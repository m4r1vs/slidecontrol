<h1 align="center">
  <img title="slidecontrol logo" alt="Slidecontrol Logo" src="https://raw.githubusercontent.com/m4r1vs/slidecontrol/master/slide-control-pwa/src/assets/slidecontrol_logo_gh.png">
</h1>
<div align="center">
  ⚠ slidecontrol is still work in progress, hence there might be some bugs present ⚠<br />
  <strong>SLIDECONTROL is a PWA and Chrome Extension which allows you to control your slides!</strong>
</div>
<div align="center">
  <sub>&lt;coded/&gt; with ❤︎ and ☕ by <a href="https://github.com/m4r1vs">Marius Niveri</a>
</div>

## Getting started 🚀
Slidecontrol's extension is available in
the [Chrome webstore](https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg) or
by installing it locally:
```sh
git clone https://github.com/m4r1vs/slidecontrol.git
cd ./slidecontrol/slide-control-extension
npm install
npm run build
```
This build the extension into the folder `/slide-control-extension/build` which can then be added by navigating
to `chrome://extensions` and clicking `Load unpacked`.

Following the steps after installing the extension will lead you to our PWA (`/slide-control-pwa`), available
at [slidecontrol.niveri.xyz](https://sc.niveri.xyz).

![Screenshot of slidecontrols homescreen](https://maniyt.de/screenshot1.png)
## Contributing 😊
To contribute to the PWA just run this:
```sh
git clone https://github.com/m4r1vs/slidecontrol.git
cd ./slidecontrol/slide-control-pwa
npm install
npm run start
```
And to help improving the extension you can install it locally as descrived above.

And finally to run the WebSocket on your machine you can just cd into it and run it:
```sh
git clone https://github.com/m4r1vs/slidecontrol.git
cd ./slidecontrol/slide-control-server
npm install
node server.js
```

In order to connect to it with the PWA and/or extension you need to head into their options and enter your IP (or just `wss://localhost:PORT`)
and everything should work out perfectly.

## Screenshots 📸
*Slidecontrol has a build in QR-Scanner to connect to your presentation.*
![Screenshot of slidecontrols QR-Scanner](https://maniyt.de/screenshot2.png)
*The speakers notes are synced on your phone as well.*
![Screenshot of slidecontrols controller](https://maniyt.de/screenshot3.png)
*Finally there's also a laser-pointer which is controllable from the app.*
![Screenshot of slidecontrols controller](https://maniyt.de/screenshot4.png)