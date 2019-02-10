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
by installing it locally (clone `/slide-control-extension` and add it to `chrome://extensions`).

Following the steps after installation will lead you to our PWA `/slide-control-pwa`, available
at [slidecontrol.niveri.xyz](https://sc.niveri.xyz).

![Screenshot of slidecontrols homescreen](https://maniyt.de/screenshot1.png)
## Contributing 😊
To contribute to the PWA just run this:
```sh
git clone https://github.com/m4r1vs/slidecontrol.git
cd ./slidecontrol/slide-control-pwa
npm run start
```
And to help improving the extension you can install it locally.
[Here](https://blog.hunter.io/how-to-install-a-chrome-extension-without-using-the-chrome-web-store-31902c780034) you can learn how to do so.

And finally to run the WebSocket server on your machine you should `cd ./slide-control-server` and `LOCAL=true node server.js`.
Then, in order to make the PWA and/or extension connect to the local server, you need to change the IP in the files.
Maybe just `CTRL + F` 'maniyt.de' which is the domain of my experimental server the socket is hosted on.

![Screenshot of slidecontrols QR-Scanner](https://maniyt.de/screenshot2.png)
*Slidecontrol has a build in QR-Scanner to connect to your presentation.*
![Screenshot of slidecontrols controller](https://maniyt.de/screenshot3.png)
*The speakers notes are synced on your phone as well.*
![Screenshot of slidecontrols controller](https://maniyt.de/screenshot4.png)
*Finally there's also a laser-pointer which is controllable from the app.*