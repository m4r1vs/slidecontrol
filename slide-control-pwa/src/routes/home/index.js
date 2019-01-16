import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.scss';

const Home = () => (
	<div class={style.home}>
		<h1>slidecontrol</h1>
		<input type="number"></input>
		<Link href="/controller/hello">Me</Link>
	</div>
);

export default Home;
