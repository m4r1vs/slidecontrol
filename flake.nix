{
  description = "A very basic flake";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs = {
    self,
    nixpkgs,
    ...
  }: let
    lib = nixpkgs.lib;
    supportedSystems = [
      "x86_64-linux"
      "i686-linux"
      "aarch64-linux"
      "riscv64-linux"
      "aarch64-darwin"
    ];
    forAllSystems = lib.genAttrs supportedSystems;
  in {
    devShell = forAllSystems (
      system: let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
        with pkgs;
          mkShell {
            buildInputs = [
              bun
              nodejs
            ];
          }
    );

    packages = forAllSystems (
      system: let
        pkgs = import nixpkgs {
          inherit system;
        };
      in {
        slidecontrol-extension = pkgs.buildNpmPackage {
          pname = "slidecontrol-extension";
          version = "0.1.0";

          src = ./slide-control-extension;

          nativeBuildInputs = [pkgs.makeWrapper];
          buildInputs = [pkgs.bun];

          npmDepsHash = "sha256-GXmdkO4iselSguNt4bhj7yyag3erzA1mAlSsKyFkX8U=";

          installPhase = ''
            runHook preInstall

            mkdir -p $out/slidecontrol
            mv build/* $out/slidecontrol/

            runHook postInstall
          '';

          meta = {
            description = "Slide Control Extension for Chromium";
          };
        };

        slidecontrol-server = pkgs.buildNpmPackage {
          pname = "slidecontrol-server";
          version = "0.1.0";

          src = ./slide-control-server;

          nativeBuildInputs = [pkgs.makeWrapper];
          buildInputs = [pkgs.nodejs];

          npmDepsHash = "sha256-v/2CUR9mB7ybE1OgqpuNN0WnvsohcDS4uOZnZw/B1Xw=";

          installPhase = ''
            runHook preInstall

            mkdir -p $out/runtime
            mkdir -p $out/bin

            mv build/server.bundle.js $out/runtime/server.js

            makeWrapper ${pkgs.nodejs}/bin/node $out/bin/slidecontrol-server \
              --add-flags "$out/runtime/server.js"

            runHook postInstall
          '';

          meta = {
            description = "Slide Control Server";
          };
        };

        slidecontrol-pwa = pkgs.buildNpmPackage {
          pname = "slidecontrol-pwa";
          version = "0.1.0";

          src = ./slide-control-pwa;

          npmDepsHash = "sha256-AVEnpI9pxfhsOjgo/TsGtxDrY3z+TMp3isOcGi0/6/g=";

          installPhase = ''
            runHook preInstall

            mkdir -p $out/dist
            mv dist/* $out/dist/

            runHook postInstall
          '';

          meta = {
            description = "Slide Control PWA";
          };
        };
      }
    );

    nixosModules.slidecontrol-server = {
      config,
      lib,
      pkgs,
      ...
    }:
      with lib; let
        cfg = config.services.slidecontrol-server;
        serverPkg = self.packages.${pkgs.system}.slidecontrol-server;
      in {
        options.services.slidecontrol-server = {
          enable = mkEnableOption "Slide Control Server service";

          package = mkOption {
            type = types.package;
            default = serverPkg;
            description = "The slidecontrol-server package to use.";
          };

          user = mkOption {
            type = types.str;
            default = "slidecontrol";
            description = "User account under which slidecontrol-server runs.";
          };

          group = mkOption {
            type = types.str;
            default = "slidecontrol";
            description = "Group under which slidecontrol-server runs.";
          };

          dataDir = mkOption {
            type = types.path;
            default = "/var/lib/slidecontrol-server";
            description = "The directory where slidecontrol-server stores its data.";
          };

          port = mkOption {
            type = types.port;
            default = 3000;
            description = "Port number the server will listen on.";
          };

          sslProxy = mkOption {
            type = types.bool;
            default = true;
            description = "Set to true (default) if the slidecontrol-server is behind an SSL proxy";
          };

          sslCert = mkOption {
            type = types.nullOr types.path;
            default = null;
            description = "SSL certififcate to use (if not using an SSL proxy server).";
          };

          sslKey = mkOption {
            type = types.nullOr types.path;
            default = null;
            description = "SSL certififcate to use (if not using an SSL proxy server).";
          };

          presentationIDLength = mkOption {
            type = types.int;
            default = 5;
            description = "The amount of digits a presentation ID has. Defaults to 5.";
          };
        };

        config = mkIf cfg.enable {
          users.users.${cfg.user} = {
            isSystemUser = true;
            group = cfg.group;
            home = cfg.dataDir;
          };

          users.groups.${cfg.group} = {
            name = cfg.group;
          };
          systemd.tmpfiles.rules = [
            "d ${cfg.dataDir}   0750 ${cfg.user} ${cfg.group} -   -"
          ];

          systemd.services.slidecontrol-server = {
            description = "Slide Control Server";
            after = ["network.target"];
            wantedBy = ["multi-user.target"];

            serviceConfig = {
              User = cfg.user;
              Group = cfg.group;
              WorkingDirectory = cfg.dataDir;

              Environment = [
                "PORT=${toString cfg.port}"
                "SSL_PROXY=${
                  if cfg.sslProxy
                  then "YES"
                  else "NO"
                }"
                "SSL_CERT=${toString cfg.sslCert}"
                "SSL_KEY=${toString cfg.sslKey}"
                "PRESENTATION_ID_LENGTH=${toString cfg.presentationIDLength}"
              ];

              ExecStart = "${cfg.package}/bin/slidecontrol-server";

              Restart = "on-failure";
              RestartSec = "5s";

              PrivateTmp = true;
              ProtectSystem = "strict";
              ProtectHome = true;
              NoNewPrivileges = true;

              ReadWritePaths = [cfg.dataDir];
            };
          };
          assertions = [
            {
              assertion = (cfg.sslKey != null && cfg.sslCert != null) -> !cfg.sslProxy;
              message = "services.slidecontrol-server: sslProxy must be false when sslKey and sslCert are provided (server handles SSL directly).";
            }
            {
              assertion = (cfg.sslKey != null) == (cfg.sslCert != null);
              message = "services.slidecontrol-server: sslKey and sslCert must either both be provided (paths) or both be null.";
            }
            {
              assertion =
                if cfg.sslKey != null
                then builtins.pathExists cfg.sslKey
                else true;
              message = "services.slidecontrol-server: Provided sslKey path does not exist: ${toString cfg.sslKey}";
            }
            {
              assertion =
                if cfg.sslCert != null
                then builtins.pathExists cfg.sslCert
                else true;
              message = "services.slidecontrol-server: Provided sslCert path does not exist: ${toString cfg.sslCert}";
            }
          ];
        };
      };

    overlays.default = final: prev: {
      slidecontrol-server = self.packages.${prev.system}.slidecontrol-server;
      slidecontrol-pwa = self.packages.${prev.system}.slidecontrol-pwa;
      slidecontrol-extension = self.packages.${prev.system}.slidecontrol-extension;
    };
  };
}
