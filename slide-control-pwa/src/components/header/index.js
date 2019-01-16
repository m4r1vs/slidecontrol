import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.scss';

const Header = () => (
	<header class={style.header}>
		<h1>slidecontrol</h1>
	</header>
);

export default Header;
