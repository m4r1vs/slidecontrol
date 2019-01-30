import { h, Component } from 'preact';
import firebase from 'firebase/app';
import 'firebase/firestore';

import style from './style.scss';
import { route } from 'preact-router';

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
					this.props.showSnackbar(`The code you entered (${this.props.id}) is invalid.`, 'BACK', () => route('/'));
				}
				else {
					this.props.showSnackbar(`Connected to Slide #${this.props.id}`, () => console.log('Hey there :)'));
					presentations.doc(this.props.id).update({
						devicesConnected: doc.data().devicesConnected + 1
					});
				}

			});
	}
	
	render({ id }) {
		return (
			<div class={style.controller}>
				<h1>slidecontrol #{id}</h1>
				<div class={style.container}>
					<div class={style.previousButton} onClick={this.previousSlide} />
					<div class={style.nextButton} onClick={this.nextSlide} />
				</div>
			</div>
		);
	}
}
