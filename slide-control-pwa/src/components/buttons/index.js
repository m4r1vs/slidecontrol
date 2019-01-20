import { h } from 'preact';
import style from './style.scss';

const Button = ({ text, action }) => <button class={style.button} onClick={action}>{text}</button>;

export default Button;