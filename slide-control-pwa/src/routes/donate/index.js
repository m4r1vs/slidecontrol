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
					Hi there, we are very, very flattered that you are thinking about supporting us and the devlopment of this small app!
				</p>
				<p>
					Before you continue we would like to get a chance of introducing us to you though. You should know who your tip goes to:
				</p>
				<p>
					We are Niels and Marius,
					both {new Date().getFullYear() - 2002} years old students from the north of Germany. We initially developed slidecontrol
					as a side project for high school but decided to continue working on it afterwards when we realized that we filled a gap. But how much does it cost us?
				</p>
				<p>
					Keeping slidecontrol running costs us exactly 8€ (and some of our free time of course) a month for our server which we happily pay on our own.
					However since we don't like the idea of ads and other privacy-nightmares
					like Analytics we draw this motivation from you (bills don't pay themselves unfortunately).
				</p>	
				<p>
					If you are a student like us or just going through tough times you do not have to pay anything of course,
					giving us an honest review on the <a target="_blank" rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=xyz.appmaker.ozgstz">Play Store</a> is
					just as much appreciated!
				</p>
				<p>
					But if you now decided to give us a tip, you can either choose one of the things below
					or <a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/">set the amount on your own</a>, love you x3000 :)
				</p>

				<div class={style.icons}>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/1.29eur"><DoughnutIcon title="We love donuts (1.29€)" /></a>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/4.9eur"><BeerIcon title="Buy us some beer (4.9€)" /></a>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/9.5eur"><PizzaIcon title="Donate us a pizza to share (9.5€)" /></a>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/14.99eur"><ChickenIcon title="Nothing tops a good ol' KFC bucket (14.99€)" /></a>
					<a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/MariusNiveri/59.49eur"><BrushIcon title="Or even a generous month of Adobe (59.49€)" /></a>
				</div>

				<p>
					The icons above will redirect you to PayPal which should be fine for most. If you got some crypto currencies laying around,
					we do also
					have <a href="#BTC" onClick={() => alert('BTC: 1GWG2p1coBJjXv4N6AoktHntfeE94Z2ZsA')}>Bitcoin</a> and <a href="#ETH" onClick={() => alert('ETH: 0x035B4C8a05676e2063006f33C5BF2b6215a9A482')}>Ethereum</a> wallets.
					If your prefered way is not on the list, just <a href="mailto:marius.niveri@gmail.com">let us know by mail</a> and we will figure it out together. Thanks!
				</p>

			</div>
		);
	}
}