import { h, Component } from 'preact';
import firebase from 'firebase/app';
import 'firebase/firestore';

import style from './style.scss';

export default class Profile extends Component {

	constructor(props) {
		super(props);
	}

	nextSlide() {
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).get()
			.then(doc => {
				console.log(doc.data());
			});
	}

	componentWillMount(props) {
		this.db = firebase.firestore();
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).get()
			.then(doc => {
				if (!doc.exists) {
					if (window) alert('Wrong ID');
				}
			});
	}
	
	render({ id }) {
		return (
			<div class={style.profile}>
				<h1 onClick={this.nextSlide}>Controller #{id}</h1>
			</div>
		);
	}
}
