import { h, Component } from 'preact';
import style from './style.scss';

export default class Profile extends Component {

	componentDidMount() {
		console.log('mounted');
	}
	
	render({ id }) {
		return (
			<div class={style.profile}>
				<h1>Controller #{id}</h1>
			</div>
		);
	}
}
