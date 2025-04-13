import style from "./style.module.scss";
import gprSVG from "../../assets/gdpr_art.svg";

const AboutPrivacy = () => (
  <div class={style.about} data-fade-in="true">
    <section>
      <h1>What we know</h1>
      <p>
        We do not track a lot about you. But in order to make slidecontrol work
        we need to temporaraly have your slide&apos;s notes, title and position
        to be accessed. However they only live in our servers (hosted on{" "}
        <a
          href="https://uberspace.de/"
          rel="noopener noreferrer"
          target="_blank"
        >
          uberspace.de
        </a>
        ) RAM until you close your connection from the computer.
      </p>
      <img src={gprSVG} />
      <p>
        You can also{" "}
        <a
          href="https://github.com/m4r1vs/slidecontrol/"
          rel="noopener noreferrer"
          target="_blank"
        >
          visit our GitHub
        </a>{" "}
        to get further insight in what exactly goes on under the hood if you are
        curious, of course.
      </p>
      <p>
        Otherwise we do also have the small website analytics tool tracker{" "}
        <a
          href="https://ticksel.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          ticksel.com
        </a>{" "}
        in place. It only tracks how long you are on slidecontrol and from what
        city you visit us by IP address. If you want to see the script,{" "}
        <a href="/analytics.js" target="_blank">
          here
        </a>{" "}
        you go.
      </p>
      <p>
        But if you don&apos;t feel like we should know you exist, you can turn
        on the Do-Not-Track setting in your Browser of choice and you will not
        be tracked at all by us.{" "}
        <a
          href="https://allaboutdnt.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Here
        </a>{" "}
        you can learn how to do so.
      </p>
      <h2>Our Privacy Policy</h2>
      <p>
        Your privacy is important to us. It is slidecontrol&apos;s policy to
        respect your privacy regarding any information we may collect from you
        across our website,{" "}
        <a href="https://slides.niveri.dev">https://slides.niveri.dev</a>, and
        other sites we own and operate.
      </p>
      <p>
        We only ask for personal information when we truly need it to provide a
        service to you. We collect it by fair and lawful means, with your
        knowledge and consent. We also let you know why we’re collecting it and
        how it will be used.
      </p>
      <p>
        We only retain collected information for as long as necessary to provide
        you with your requested service. What data we store, we’ll protect
        within commercially acceptable means to prevent loss and theft, as well
        as unauthorised access, disclosure, copying, use or modification.
      </p>
      <p>
        We don’t share any personally identifying information publicly or with
        third-parties, except when required to by law.
      </p>
      <p>
        Our website may link to external sites that are not operated by us.
        Please be aware that we have no control over the content and practices
        of these sites, and cannot accept responsibility or liability for their
        respective privacy policies.
      </p>
      <p>
        You are free to refuse our request for your personal information, with
        the understanding that we may be unable to provide you with some of your
        desired services.
      </p>
      <p>
        Your continued use of our website will be regarded as acceptance of our
        practices around privacy and personal information. If you have any
        questions about how we handle user data and personal information, feel
        free to contact us.
      </p>
      <p>This policy is effective as of 9 February 2019.</p>
    </section>
  </div>
);

export default AboutPrivacy;
