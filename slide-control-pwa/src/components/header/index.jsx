import { Component } from "preact";
import style from "./style.module.scss";

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      shadow: false,
    };
  }

  componentDidMount() {
    window.onscroll = () => {
      if (document.documentElement.scrollTop > 0 && !this.state.shadow)
        this.setState({
          shadow: true,
        });
      else if (document.documentElement.scrollTop <= 0)
        this.setState({
          shadow: false,
        });
    };
  }

  render({ title, arrow, color, transparent, small, children, onNavClick }) {
    return (
      <header
        tabIndex={0}
        data-shadow={this.state.shadow || !transparent}
        data-small={small}
        data-transparent={transparent}
        class={style.header}
        style={{ background: color }}
      >
        <div
          role="button"
          aria-label={arrow ? "go back" : "toggle menu"}
          class={style.navbtn}
          id={arrow ? "navbtn-arrow" : "navbtn"}
          onClick={onNavClick}
        >
          <span id="navbtn-span1" />
          <span id="navbtn-span2" />
          <span id="navbtn-span3" />
        </div>
        <h1>{title}</h1>
        {children}
      </header>
    );
  }
}
