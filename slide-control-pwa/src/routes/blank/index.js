import { h } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router';

const Blank = props => (
	<div class={style.blank} fadeIn>
		
		<div class={style.art} />

		<p>
			Huh, I don't exist here :/<br /><br />
			<Link href="/">GO HOME</Link>
		</p>
		
	</div>
);

export default Blank;