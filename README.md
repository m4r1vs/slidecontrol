<h1 align="center">
  <img title="slidecontrol logo" alt="Slidecontrol Logo" src="https://raw.githubusercontent.com/m4r1vs/slidecontrol/master/slide-control-pwa/src/assets/slidecontrol_logo_gh.png">
</h1>
<div align="center">
  ⚠ Attention: slidecontrol is still in beta and there might be some bugs present! ⚠<br />
  <strong>SLIDECONTROL is a PWA and Chrome Extension which allows you to control your slides!</strong>
</div>
<div align="center">
  <sub>&lt;coded/&gt; with ❤︎ and ☕ by <a href="https://github.com/m4r1vs">Marius Niveri</a>
</div>
<br />
<br />

## Getting started 🚀
To try it on your own run the following commands after you installed [yarn](https://yarnpkg.com/lang/en/):
```sh
yarn
yarn start
```
If you don't have [yarn](https://yarnpkg.com/lang/en/) installed, go ahead and do it. It's definitely worth it ;)
If you have [nvm](https://github.com/creationix/nvm), you also should run `nvm use v8` to use node version 8.X.X
## Live Demo 🎉
If you want to see how it currently looks like, you can go ahead and give it a visit via [https://mnged.me](https://mnged.me). This page is hosted on Firebase Hosting and should be updated. But please don't get driven crazy if something does not work. Everything is still under construction!
## About
MNGED is a so called Progressive Web App (PWA). PWA's stand out because they are fast 🚀 and always work, even with no connection to the internet.
![Screenshot of slidecontrol](https://raw.githubusercontent.com/m4r1vs/slidecontrol/master/slide-control-pwa/src/assets/Phone%20Angle%201.png)
MNGED uses [Firebase 🔥](https://firebase.google.com) for authentication and as a database. Firebase is developed and maintained by Google. The authentication is build by the same team that also build the Google Sign In and is responsible for other security at Google. But that also means that Google has access to our database which you may or may not care about.

As the UI provider I decided to go with [Preact](https://preactjs.com), a lightweight 3kb fork of React. For storing the state I use [MobX](https://mobx.js.org/getting-started.html), it's a simple but powerful state management solution. And finally as the database I went with Firebase, a mostly free hosting and database provided by Google. The nice thing about firebase is that it comes with a nice JavaScript library which enables Authentication and live-updates when the database changes.
## Contributers 😊
Huge thanks to [Jason Miller](https://github.com/developit/) for building Preact and the Preact CLI. And also thanks to him for helping this projects to gain some popularity with his [Twitter Quote](https://twitter.com/_developit/status/923555370219470848)!