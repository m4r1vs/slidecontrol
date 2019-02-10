import { h, Component } from 'preact';
import style from './style.scss';

import { DoughnutIcon, BeerIcon, PizzaIcon, ChickenIcon, BrushIcon } from '../../components/icons';


export default class Donate extends Component {
	
	constructor() {
		super();
		this.state = null;
	}
	
	componentDidMount() {
		document.querySelectorAll('.applyHoverEffect').forEach((element) => {
			const hoverColor = element.getAttribute('fill'); // get the fill color
			// set it as a custom property inline
			if (hoverColor) element.style.setProperty('--hover-color', hoverColor);
		});
	}

	render() {
		return (
			<div class={style.donate}>

				<p>
					Hi there, we are very flattered that you are thinking of giving us a small tip for our work!
				</p>
				<p>
					Maintaining open source projects like slidecontrol is fun and important but bills still have
					to be payed so every donation is very much appreciated.
				</p>
				<p>
					You can either choose one of the things below
					or <a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/">set the amount you wish to tip</a> :)
				</p>

				<div class={style.icons}>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/1.29eur"><DoughnutIcon title="We love donuts (1.29€)" /></a>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/4.9eur"><BeerIcon title="Buy us some beer (4.9€)" /></a>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/9.5eur"><PizzaIcon title="Donate us a pizza to share (9.5€)" /></a>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/14.99eur"><ChickenIcon title="Nothing tops a good ol' KFC bucket (14.99€)" /></a>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/59.49eur"><BrushIcon title="Or even a generous month of Adobe (59.49€)" /></a>
				</div>

				<p>
					The icons above will redirect you to PayPal which we believe will be just fine for this purpose and even if you don't have an account you should be able to
					just use a credit card without having to sign in.
				</p>

			</div>
		);
	}
}