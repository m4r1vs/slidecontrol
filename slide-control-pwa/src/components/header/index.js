import { h } from 'preact';
import style from './style.scss';

const Header = ({ title, arrow, transparent, small, children, onNavClick }) => (
	<header small={small} transparent={transparent} class={style.header}>
		<div class={style.navbtn} id={arrow ? 'navbtn-arrow' : 'navbtn'} onClick={onNavClick}>
			<span id="navbtn-span1" />
			<span id="navbtn-span2" />
			<span id="navbtn-span3" />
		</div>
		<h1>{title}</h1>
		{children}
	</header>
);

export default Header;