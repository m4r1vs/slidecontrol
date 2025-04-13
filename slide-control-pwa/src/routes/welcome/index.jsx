import style from "./style.module.scss";
import Button from "../../components/buttons";

import lang from "./languages";

const Welcome = () => (
  <div class={style.welcome} data-fade-in="true">
    <h1>{lang.page.title}</h1>

    <p>{lang.page.description}</p>

    <div class={style.qr} />

    <Button to="/help" inverse text="slides.niveri.dev/help" />
  </div>
);

export default Welcome;
