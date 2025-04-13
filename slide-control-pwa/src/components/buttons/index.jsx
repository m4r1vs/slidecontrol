import PropTypes from "prop-types";
import style from "./style.module.scss";
import { route } from "preact-router";

const Button = ({ text, action, to, disabled, inverse, href }) => {
  function clickHandler(e) {
    e.srcElement.blur();
    if (to) route(to);
    else action();
  }

  return !href ? (
    <button
      disabled={disabled}
      data-disabled-css={disabled}
      data-inverse={inverse}
      class={style.button}
      onClick={clickHandler}
    >
      {text}
    </button>
  ) : (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      data-disabled-css={disabled}
      data-inverse={inverse}
      class={style.button}
    >
      {text}
    </a>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func,
  to: PropTypes.string,
  disabled: PropTypes.bool,
  inverse: PropTypes.bool,
  href: PropTypes.string,
};

Button.defaultProps = {
  action: null,
  to: null,
  disabled: false,
  inverse: false,
  href: null,
};

export default Button;
