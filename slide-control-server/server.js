/**
 * Slidecontrol - The open-source remote control solution
 * Copyright (C) 2019 Marius Niveri <marius.niveri@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.
 *
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Libs
const WebSocket = require("ws");
const fs = require("fs");
const http = require("http");
const https = require("https");

// SlideControl server
const SlidecontrolServer = require("./slidecontrolServer");

// functions
const httpRouter = require("./functions/httpRouter");
const Logger = require("./functions/logger");

// Config is package.json
const CONFIG = require("./package.json");

// make some stuff globally available
global.Logger = Logger;

// create servers
const httpServer = process.env.SSL_PROXY === "NO"
  ? new https.createServer({
      cert: fs.readFileSync(process.env.SSL_CERT),
      key: fs.readFileSync(process.env.SSL_KEY),
    })
  : new http.createServer((req, res) => httpRouter(req, res));
const wssServer = new WebSocket.Server({ server: httpServer });

// make WebSocket server available for children:
global.wssServer = wssServer;

// start SC server
const slidecontrolServer = new SlidecontrolServer();

// Let SC server handle new websocket connection
wssServer.on("connection", slidecontrolServer.handleNewConnection);

httpServer.listen(process.env.PORT, (error) => {
  Logger.debug("Debugging is enabled, with config: ", CONFIG);
  Logger.debug("With env: ", process.env);

  if (error) return Logger.error("Error starting Server: ", error);

  Logger.log(
    `Server v${CONFIG.version}-${__webpack_hash__} is listening on port ${process.env.PORT}`,
  );
});
