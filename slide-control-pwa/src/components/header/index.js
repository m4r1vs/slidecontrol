import { h, Component } from 'preact';
import style from './style.scss';

export default class Header extends Component {

	constructor() {
		super();
		this.state = {
			shadow: false
		};
	}

	componentDidMount() {
		window.onscroll = e => {
			if (document.documentElement.scrollTop > 0 && !this.state.shadow) this.setState({
				shadow: true
			});
			else if (document.documentElement.scrollTop <= 0) this.setState({
				shadow: false
			});
		};
	}

	render({ title, arrow, color, transparent, small, children, onNavClick }) {
		return (
			<header shadow={this.state.shadow || !transparent} small={small} transparent={transparent} class={style.header} style={{ background: color }}>
				<div class={style.navbtn} id={arrow ? 'navbtn-arrow' : 'navbtn'} onClick={onNavClick}>
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