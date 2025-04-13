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

import { Component } from "preact";
import { route, Router } from "preact-router";

import Localization from "../lib/localization";

// routes
import Home from "../routes/home";
import Help from "../routes/help";
import Controller from "../routes/controller";
import About from "../routes/about";
import AboutCredits from "../routes/about/credits";
import AboutUs from "../routes/about/us";
import AboutPrivacy from "../routes/about/privacy";
import AboutCode from "../routes/about/code";
import Welcome from "../routes/welcome";

// Components
import Snackbar from "../components/snackbar";
import Header from "../components/header";
import Nav from "../components/nav";
import Blank from "../routes/blank";
import Settings from "../routes/settings";
import Donate from "../routes/donate";
import Scanner from "../routes/scanner";
import AboutLicenses from "../routes/about/licenses";

import lang from "./languages";

export default class App extends Component {
  /**
   * This function will hide the snackbar
   */
  hideSnackbar = () => {
    this.setState({
      notification: {
        text: null,
        actionText: null,
        clickAction: () => console.error("cLiCkEd An EmTy NoTiFiCaTiOn :!§"),
      },
    });
  };

  /**
   * Show the snackbar with given information
   */
  showSnackbar = (text, actionText, delay, clickAction) => {
    clearTimeout(this.timeout);

    const _clickAction = () => {
      this.hideSnackbar();
      clickAction();
    };

    this.setState({
      notification: {
        text,
        actionText,
        clickAction: _clickAction,
      },
    });
    this.timeout = setTimeout(this.hideSnackbar, delay);
  };

  /**
   * Gets fired on route change
   */
  handleRoute = (route) => {
    document.body.focus();

    document.body.style.background = "var(--background-color)";
    let attributes = route.active[0].props;

    this.setState({
      headerTitle: attributes.title,
      headerTransparent: !!attributes.transparentHeader,
      headerArrow: !!attributes.arrowHeader,
      headerColor: attributes.theme,
      headerSmall: !!attributes.smallHeader,
      headerChildren: !!attributes.changeHeaderChildren,
    });

    // if (typeof window !== 'undefined') {
    // 	let color = attributes.theme.split('(')[1];
    // 	color = color.substring(0, color.length-1);
    // 	color = window.getComputedStyle(document.documentElement).getPropertyValue(color);
    // 	document.querySelector('meta[name=theme-color]').setAttribute('content', color);
    // }
  };

  /**
   * What should happen when the nav button is clicked
   */
  handleNavClick = () => {
    if (this.state.headerArrow) {
      if (window.history.length > 1) window.history.back();
      else route("/");
    } else {
      // hide navigation Drawer
      document.body.style.overflow = "hidden";
      const drawer = document.getElementById("drawer");
      const greyback = document.getElementById("drawerback");
      greyback.style.display = "block";
      drawer.style.transition =
        "margin-left .16s cubic-bezier(0.0, 0.0, 0.2, 1)";
      greyback.style.transition = "opacity .16s linear";
      drawer.style.opacity = "1";
      greyback.style.opacity = "1";
      drawer.style.marginLeft = "0px";
      drawer.focus();
    }
  };

  changeHeaderTitle = (title) =>
    this.setState({
      headerTitle: title,
    });

  changeHeaderChildren = (children) =>
    this.setState({
      headerChildren: children,
    });

  makeItLit(litness) {
    if (litness && typeof window !== "undefined") {
      console.error("This is too lit for the console to handle");
      localStorage.setItem("slidecontrolLit", "totally");
      document.documentElement.style.setProperty("--primary-color", "#2eff21");
      document.documentElement.style.setProperty(
        "--primary-color-dark",
        "#099400",
      );
      document.documentElement.style.setProperty(
        "--background-color",
        "#020e00",
      );
      document
        .querySelector("meta[name=theme-color]")
        .setAttribute("content", "#020e00");
    }
  }

  constructor(props) {
    super(props);

    if (typeof window !== "undefined")
      localStorage.setItem("slidecontrol-language", Localization.language);

    this.state = {
      headerTransparent: true,
      headerSmall: false,
      headerArrow: false,
      headerTitle: "",
      headerChildren: <div />,
    };

    this.timeout = null;
    this.handleRoute = this.handleRoute.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this);
    this.changeHeaderTitle = this.changeHeaderTitle.bind(this);
    this.changeHeaderChildren = this.changeHeaderChildren.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
    this.makeItLit = this.makeItLit.bind(this);
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("slidecontrol-websocket-ip"))
        localStorage.setItem(
          "slidecontrol-websocket-ip",
          "wss://sc-server.niveri.dev",
        );
      if (localStorage.getItem("slidecontrolLit") === "totally")
        this.makeItLit(true);
    }

    window.addEventListener("online", () =>
      this.showSnackbar(
        lang.notifications.internet.connected,
        lang.notifications.internet.reload,
        4000,
        location.reload,
      ),
    );

    window.addEventListener("offline", () =>
      this.showSnackbar(
        lang.notifications.internet.disconnected,
        lang.notifications.internet.reload,
        4000,
        location.reload,
      ),
    );
  }

  render() {
    return (
      <div id="app">
        {/* Global Components */}
        <Nav />
        <Header
          small={this.state.headerSmall}
          transparent={this.state.headerTransparent}
          arrow={this.state.headerArrow}
          color={this.state.headerColor}
          onNavClick={this.handleNavClick}
          title={this.state.headerTitle}
        >
          {this.state.headerChildren}
        </Header>
        <Snackbar {...this.state.notification} />

        {/* Different routes (ignored by prerender) */}
        {typeof window !== "undefined" && (
          <Router onChange={this.handleRoute}>
            <Home
              makeItLit={this.makeItLit}
              languages={["en", "de"]}
              showSnackbar={this.showSnackbar}
              path="/"
              title={lang.titles.home}
              theme="var(--background-color)"
              transparentHeader
            />
            <Help
              path="/help"
              title={lang.titles.help}
              theme="var(--primary-color)"
              arrowHeader
            />
            <Scanner
              showSnackbar={this.showSnackbar}
              path="/scanner"
              title={lang.titles.scanner}
              theme="var(--primary-color)"
              arrowHeader
            />

            <Controller
              languages={["en", "de"]}
              smallHeader
              changeHeaderTitle={this.changeHeaderTitle}
              changeHeaderChildren={this.changeHeaderChildren}
              showSnackbar={this.showSnackbar}
              path="/controller/:id"
              theme="var(--primary-color)"
              title={lang.titles.controller}
              arrowHeader
            />

            <Settings
              languages={["en", "de"]}
              path="/settings"
              title={lang.titles.settings}
              showSnackbar={this.showSnackbar}
              theme="var(--background-color)"
              transparentHeader
            />
            <Donate
              path="/donate"
              title={lang.titles.donate}
              theme="var(--background-color)"
              transparentHeader
            />

            <About
              path="/about"
              title={lang.titles.about}
              theme="var(--background-color)"
              transparentHeader
            />
            <AboutUs
              path="/about/us"
              title={lang.titles.aboutUs}
              theme="var(--primary-color)"
              arrowHeader
            />
            <AboutCode
              path="/about/code"
              title={lang.titles.aboutCode}
              theme="var(--primary-color)"
              arrowHeader
            />
            <AboutPrivacy
              path="/about/privacy"
              title={lang.titles.aboutPrivacy}
              theme="var(--primary-color)"
              arrowHeader
            />
            <AboutCredits
              path="/about/credits"
              title={lang.titles.aboutCredits}
              theme="var(--primary-color)"
              arrowHeader
            />
            <AboutLicenses
              path="/about/licenses"
              title={lang.titles.aboutLicenses}
              theme="var(--primary-color)"
              arrowHeader
            />

            <Welcome
              path="/welcome"
              title={lang.titles.welcome}
              theme="var(--primary-color)"
              arrowHeader
            />

            <Blank
              default
              title={lang.titles.blank}
              theme="var(--background-color)"
              transparentHeader
            />
          </Router>
        )}
      </div>
    );
  }
}
