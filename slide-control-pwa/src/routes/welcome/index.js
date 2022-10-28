import { h } from 'preact';
import style from './style.scss';
import Button from '../../components/buttons';

import lang from './languages';

const Welcome = props => (
	<div class={style.welcome} fadeIn>
		<h1>
			{lang.page.title}
		</h1>

		<p>
			{lang.page.description}
		</p>
		
		<div class={style.qr} />

		<Button to="/help" inverse text="sc.niveri.de/help" />

	</div>
);

export default Welcome;