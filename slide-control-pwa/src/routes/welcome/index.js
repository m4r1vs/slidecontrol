import { h } from 'preact';
import style from './style.scss';
import Button from '../../components/buttons';

const Welcome = props => (
	<div class={style.welcome} fadeIn>

		<h1>
			Welcome to slidecontrol!
		</h1>

		<p>
			Now that you have installed our Chrome Extension you are almost ready to control
			your slides.
			You just gotta visit slidecontrol on your phone now and follow the three steps there:
		</p>
		
		<div class={style.qr} />

		<Button to="/help" inverse text="sc.niveri.xyz/help" />

	</div>
);

export default Welcome;