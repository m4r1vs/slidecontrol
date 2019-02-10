import { h } from 'preact';
import style from './style.scss';
import { route } from 'preact-router';

const Button = ({ text, action, to, disabled, inverse, href }) => {

	function clickHandler(e) {
		e.srcElement.blur();
		if (to) route(to);
		else action();
	}

	return (!href)
		? <button disabled={disabled} disabledCss={disabled} inverse={inverse} class={style.button} onClick={clickHandler}>{text}</button>
		: <a
			href={href}
			rel="noopener noreferrer"
			target="_blank"
			disabled={disabled}
			disabledCss={disabled}
			inverse={inverse}
			class={style.button}
		  >{text}</a>;
};

export default Button;