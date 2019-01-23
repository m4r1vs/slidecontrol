import { h, Component } from 'preact';
import style from './style.scss';

export default class Profile extends Component {

	componentWillMount(props) {
		console.log('mounted', this.props.id);
	}
	
	render({ id }) {
		return (
			<div class={style.profile}>
				<h1>Controller #{id}</h1>
			</div>
		);
	}
}
