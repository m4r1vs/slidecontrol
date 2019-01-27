import { h, Component } from 'preact';
import firebase from 'firebase/app';
import 'firebase/firestore';

import Button from '../../components/buttons';

import style from './style.scss';

export default class Profile extends Component {
	
	nextSlide() {
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).update({
			command: 'next',
			timestamp: new Date().getTime()
		});
	}

	previousSlide() {
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).update({
			command: 'back',
			timestamp: new Date().getTime()
		});
	}
	
	constructor(props) {

		super(props);
		
		this.db = firebase.firestore();
		this.nextSlide = this.nextSlide.bind(this);
		this.previousSlide = this.previousSlide.bind(this);

	}
	
	componentWillMount(props) {
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).get()
			.then(doc => {

				if (!doc.exists) {
					if (window) alert('Wrong ID');
					location.href = '/';
				}
				else {
					presentations.doc(this.props.id).update({
						devicesConnected: doc.data().devicesConnected + 1
					});
				}

			});
	}
	
	render({ id }) {
		return (
			<div class={style.profile}>
				<h1 onClick={this.nextSlide}>Controller #{id}</h1>
				<Button text="Previous" action={this.previousSlide} />
				<Button text="Next" action={this.nextSlide} />
			</div>
		);
	}
}
