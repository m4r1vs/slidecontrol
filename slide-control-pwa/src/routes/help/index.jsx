import { Component } from "preact";
import style from "./style.module.scss";
import Button from "../../components/buttons";

import lang from "./languages";

const steps = {
  en: [
    <section data-fade-in="true" key="step1">
      <p>
        First of all, if not done already, you need to add our{" "}
        <a
          href="https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg"
          rel="noopener noreferrer"
          target="_blank"
        >
          Chrome Extension
        </a>{" "}
        to the computer you want to present from.
      </p>
      <p>
        Just search for &quot;slidecontrol&quot; in the Chrome Webstore (
        <a
          href="https://chrome.google.com/webstore"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://chrome.google.com/webstore
        </a>
        ) and click on the blue <span>Add to Chrome</span> button.
      </p>
      <br />
      <Button
        text="GET EXTENSION"
        href="https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg"
      />
    </section>,
    <section data-fade-in="true" key="step2">
      <p>
        Once slidecontrol got added you can navigate to{" "}
        <a
          href="https://docs.google.com/presentation/u/0/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Google Slides
        </a>{" "}
        on your computer and open the slide you want to control:
      </p>
      <Button
        text="GOOGLE SLIDES"
        href="https://docs.google.com/presentation/u/0/"
      />
      <br />
      <br />
      <p>
        Now there is a <span>slidecontrol</span> button in the top right of
        Google Slides, next to the button <span>Present</span>.
      </p>
      <p>
        Click <span>slidecontrol</span> to open the chosen slide in a new tab
        with slidecontrol enabled.
      </p>
    </section>,
    <section data-fade-in="true" key="step3">
      <p>
        Finally having your presentation in front of you, you are ready to get
        your slide&apos;s code.
      </p>
      <p>
        Just click on <span>start slidecontrol</span> in the bottom control-bar
        and your code will magically appear.
      </p>
      <p>
        Instead of typing in your code, there is also the option to generate a
        qr-code by clicking on <span>QR-Code</span> in the control-bar in Google
        Slides.
      </p>
      <Button to="/" text="TYPE" /> or <Button to="/scanner" text="SCAN" />
    </section>,
    <section data-fade-in="true" key="step4">
      <h2>Got stuck?</h2>
      <p>
        Contact us by <a href="mailto:marius.niveri@gmail.com">E-Mail</a> and
        let us know how much we suck and how we can help you in case you are
        having trouble :)
      </p>
      <Button href="mailto:marius.niveri@gmail.com" text="Hit us up" />
    </section>,
  ],
  de: [
    <section data-fade-in="true" key="step1">
      <p>
        Falls noch nicht erledigt, füge als aller erstes unsere{" "}
        <a
          href="https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg"
          rel="noopener noreferrer"
          target="_blank"
        >
          Chrome Erweiterung
        </a>{" "}
        an dem Computer, von welchem aus du präsentieren willst, hinzu.
      </p>
      <p>
        Suche dazu einfach nach &quot;slidecontrol&quot; im Chrome Webstore (
        <a
          href="https://chrome.google.com/webstore"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://chrome.google.com/webstore
        </a>
        ) und klicke auf <span>Hinzufügen</span>.
      </p>
      <br />
      <Button
        text="LINK ZU ERWEITERUNG"
        href="https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg"
      />
    </section>,
    <section data-fade-in="true" key="step2">
      <p>
        Erweiterung hinzugefügt? Dann gehe nun zu{" "}
        <a
          href="https://docs.google.com/presentation/u/0/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Google Präsentationen
        </a>{" "}
        an deinem Computer und rufe irgendeine Präsentation auf.
      </p>
      <Button
        text="GOOGLE PRÄSENTATIONEN"
        href="https://docs.google.com/presentation/u/0/"
      />
      <br />
      <br />
      <p>
        Jetzt solltest du einen <span>slidecontrol</span> Knopf oben rechts von
        deiner Präsentation sehen, neben dem Knopf <span>Präsentieren</span>.
      </p>
      <p>
        Klicke auf <span>slidecontrol</span> um deine Präsentation mit
        slidecontrol aktiviert zu öffnen.
      </p>
    </section>,
    <section data-fade-in="true" key="step3">
      <p>Als letztes musst du nun dein Handy mit der Präsentation verbinden.</p>
      <p>
        Klicke dazu auf <span>start slidecontrol</span> in der Leiste, die unten
        auftaucht, sobald du deine Maus an den unteren Browserrand bewegst.
      </p>
      <p>
        Nun kannst du entweder den Code der erschienen ist eingeben, oder du
        klickst auf <span>QR-Code</span> und scanst diesen mit deinem Handy
        einfach ein:
      </p>
      <Button to="/" text="TIPPEN" /> or <Button to="/scanner" text="SCANNEN" />
    </section>,
    <section data-fade-in="true" key="step4">
      <h2>Hängengeblieben?</h2>
      <p>
        Schreibe uns eine <a href="mailto:marius.niveri@gmail.com">E-Mail</a>{" "}
        und lass uns wissen, wie wir dir weiterhelfen können :)
      </p>
      <Button href="mailto:marius.niveri@gmail.com" text="E-Mail schreiben" />
    </section>,
  ],
};

export default class Help extends Component {
  nextStep() {
    this.setState((state) => ({
      step:
        state.step + 1 >
        steps[localStorage.getItem("slidecontrol-language") || "en"].length - 1
          ? steps[localStorage.getItem("slidecontrol-language") || "en"]
              .length - 1
          : state.step + 1,
    }));
  }

  previousStep() {
    this.setState((state) => ({
      step: state.step > 0 ? state.step - 1 : 0,
    }));
  }

  constructor() {
    super();

    this.state = {
      step: 0,
    };

    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
  }

  render() {
    return (
      <div class={style.help} data-fade-in="true">
        <h1>
          {lang.page.step} {this.state.step + 1}/
          {steps[localStorage.getItem("slidecontrol-language") || "en"].length -
            1}
        </h1>
        {
          steps[localStorage.getItem("slidecontrol-language") || "en"][
            this.state.step
          ]
        }
        <center class={style.buttons}>
          <Button
            action={this.nextStep}
            disabled={
              this.state.step + 1 >
              steps[localStorage.getItem("slidecontrol-language") || "en"]
                .length -
                1
            }
            text={
              this.state.step >=
              steps[localStorage.getItem("slidecontrol-language") || "en"]
                .length -
                2
                ? lang.buttons.stuck
                : lang.buttons.next
            }
          />
          <br />
          <Button
            inverse
            disabled={this.state.step <= 0}
            action={this.previousStep}
            text={lang.buttons.previous}
          />
        </center>
      </div>
    );
  }
}
