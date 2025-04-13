import { h, Component } from "preact";
import style from "./style.module.scss";
import { Link } from "preact-router/match";

export default class About extends Component {
  constructor() {
    super();

    this.serverVersion = null;
  }

  componentWillMount() {
    let url = localStorage.getItem("slidecontrol-websocket-ip");

    if (url.substring(0, 6) === "wss://")
      url = url.replace("wss://", "https://");
    else if (url.substring(0, 5) === "ws://")
      url = url.replace("ws://", "http://");

    this.setState({
      serverURL: url,
    });

    fetch(url + "/server-version")
      .then((raw) => raw.json())
      .then((res) =>
        this.setState({
          serverVersion: res.version + "-",
          serverHash: res.hash,
        }),
      )
      .catch(() =>
        this.setState({
          serverVersion: "Offline",
        }),
      );
  }

  render() {
    return (
      <div class={style.aboutList} data-fade-in="true">
        <Link href="/about/us">
          About Us
          <br />
          <span>
            Learn more about how and by whom slidecontrol was developed.
          </span>
        </Link>

        <Link href="/about/code">
          Our code
          <br />
          <span>
            Get some insights into the code working behind the scenes.
          </span>
        </Link>

        <Link href="/about/credits">
          Who we depend on
          <br />
          <span>
            Projects used for slidecontrol we want to give special credits to.
          </span>
        </Link>

        <Link href="/about/privacy">
          Your Privacy
          <br />
          <span>
            Your privacy should be important to you. Know what we know.
          </span>
        </Link>

        <Link href="/about/licenses">
          Open-Source Licenses
          <br />
          <span>
            Our license and the complete list of open-source projects we use and
            their licenses
          </span>
        </Link>

        <a
          href="https://github.com/m4r1vs/slidecontrol"
          rel="noopener noreferrer"
          target="_blank"
        >
          slidecontrol app
          <br />
          <span>Version 1</span>
        </a>

        <a
          href={this.state.serverURL}
          rel="noopener noreferrer"
          target="_blank"
        >
          slidecontrol server
          <br />
          <span>
            Version {this.state.serverVersion}
            {this.state.serverHash}
          </span>
        </a>
      </div>
    );
  }
}
