import { h, Component } from "preact";
import style from "./style.module.scss";
import Button from "../../components/buttons";

import Localization from "../../lib/localization";
import lang from "./language";

export default class Settings extends Component {
  /**
   * Save the current input to localStorage
   */
  saveServer = () => {
    let ip = this.state.serverIpInput || this.state.serverIpSelect;
    if (ip) localStorage.setItem("slidecontrol-websocket-ip", ip);

    this.setState({
      serverIp: ip,
    });

    this.props.showSnackbar(
      lang.notifications.serverSaved(ip),
      null,
      3500,
      () => console.warn("hey there dude(tte)"),
    );
  };

  /**
   * User changed the input in the <select />
   */
  changeServerIpSelect = () => {
    this.setState({
      serverIpSelect: this.serverIpSelectElement.value,
    });
  };

  /**
   * User typed into the <input type="text" />
   */
  changeServerIpInput = () => {
    this.setState({
      serverIpInput: this.serverIpInputElement.value,
    });
  };

  changeLanguage = () => {
    this.setState({
      languageSelect: this.languageSelectElement.value,
    });
    Localization.language = this.languageSelectElement.value;
    location.reload();
  };

  toggleSpeechToText = () => {
    if (localStorage.getItem("slidecontrol-cc") === "true") {
      localStorage.setItem("slidecontrol-cc", "false");
    } else localStorage.setItem("slidecontrol-cc", "true");
    this.setState((state) => ({
      speechToTextEnabled: !state.speechToTextEnabled,
    }));
  };

  constructor(props) {
    super(props);

    this.state = {
      serverIpInput: "",
      serverIpSelect: "wss://sc-server.niveri.dev",
      serverIp: "wss://sc-server.niveri.dev",
      languageSelect: localStorage.getItem("slidecontrol-language") || "en",
      speechToTextEnabled: localStorage.getItem("slidecontrol-cc") === "true",
    };

    this.toggleSpeechToText = this.toggleSpeechToText.bind(this);
    this.serverIpSelectElement = null;
  }

  componentWillMount() {
    this.setState((state) => ({
      serverIp:
        localStorage.getItem("slidecontrol-websocket-ip") || state.serverIp,
    }));
  }

  render() {
    return (
      <div class={style.settings} data-fade-in="true">
        <section>
          <h3>{lang.page.server.title}</h3>

          {/* Description */}
          <div>
            <p>{lang.page.server.description[0]}</p>
            <p>{lang.page.server.description[1]}</p>
          </div>

          <p>{lang.page.server.select.title}</p>

          <select
            id="server-options"
            ref={(select) => (this.serverIpSelectElement = select)}
            value={this.state.serverIpSelect}
            onChange={this.changeServerIpSelect}
          >
            <option value="wss://sc-server.niveri.dev">
              wss://sc-server.niveri.dev
            </option>
            <option value="wss://www.maniyt.de:61263">
              wss://www.maniyt.de:61263
            </option>
            <option value="wss://mn.uber.space/slidecontrol-socket">
              wss://mn.uber.space/slidecontrol-socket
            </option>
          </select>

          <p>{lang.page.server.input.title}</p>

          <input
            ref={(input) => (this.serverIpInputElement = input)}
            onChange={this.changeServerIpInput}
            aria-label="Or local server"
            type="text"
            placeholder="ws://localhost:1337"
            id="server-local"
          />

          <p>{lang.page.server.description[2](this.state.serverIp)}</p>

          <Button text={lang.page.server.buttonSave} action={this.saveServer} />
        </section>

        <section>
          <h3>{lang.page.language.title}</h3>

          <div>
            <p>{lang.page.language.description}</p>
          </div>

          <select
            id="server-options"
            ref={(select) => (this.languageSelectElement = select)}
            value={this.state.languageSelect}
            onChange={this.changeLanguage}
          >
            <option value="en">{lang.page.language.languages.en}</option>
            <option value="de">{lang.page.language.languages.de}</option>
          </select>
        </section>

        <section>
          <h3>{lang.page.speechToText.title}</h3>

          <div>
            <p>{lang.page.speechToText.description}</p>
          </div>

          <Button
            text={
              this.state.speechToTextEnabled
                ? lang.page.speechToText.buttonDisable
                : lang.page.speechToText.buttonEnable
            }
            action={this.toggleSpeechToText}
          />
        </section>
      </div>
    );
  }
}
