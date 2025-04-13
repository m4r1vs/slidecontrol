import style from "./style.module.scss";
import openSourceArtSVG from "../../assets/open_source_art.svg";

const AboutCredits = () => (
  <div class={style.about} data-fade-in="true">
    <section>
      <h1>Who we depend on</h1>
      <p>
        We decided to dedicate this section to the awesome projects (and people
        behind them) we are using and used to create slidecontrol.
      </p>

      <img src={openSourceArtSVG} />
      <h2>Uberspace</h2>
      <p>
        The amazing people over at{" "}
        <a
          href="https://uberspace.de/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Uberspace.de
        </a>{" "}
        are enabling us and many other people around the world to have highly
        customizable Linux servers on a budget.
      </p>
      <p>
        We are having our nodeJS WebSocket server hosted there on asteroids.
      </p>

      <h2>Firebase</h2>
      <p>
        We also make use of Google&apos;s mostly free{" "}
        <a
          href="https://en.wikipedia.org/wiki/Firebase"
          rel="noopener noreferrer"
          target="_blank"
        >
          firebase
        </a>{" "}
        service. It allows us to host our mobile app with HTTPS enabled by
        default and easy updates of code.
      </p>

      <h2>Preact</h2>
      <p>
        Of course we are also very thankful for the people behind the
        libraries/frameworks we use. The most notable one being{" "}
        <a
          href="https://github.com/developit/preact"
          rel="noopener noreferrer"
          target="_blank"
        >
          Preact
        </a>{" "}
        created by{" "}
        <a
          href="https://github.com/developit"
          rel="noopener noreferrer"
          target="_blank"
        >
          Jason Miller
        </a>
        .
      </p>

      <h2>You :)</h2>
      <p>
        And finally, if you weren&apos;t there to use our app we would probably
        lack lots of motivation to continue our work on slidecontrol.
      </p>
      <p>Thanks!</p>
    </section>
  </div>
);

export default AboutCredits;
