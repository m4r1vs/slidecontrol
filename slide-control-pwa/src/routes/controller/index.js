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

	componentDidMount() {
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).get()
			.then(doc => {

				if (!doc.exists) {
					this.props.showSnackbar(`The code you entered (${this.props.id}) is invalid.`, 'BACK', () => route('/'));
				}
				else {
					this.title = doc.data().title;
					this.notesContainer.innerHTML = doc.data().notes;
					this.props.showSnackbar(`Connected to "${this.title}"`, () => console.log('Hey there :)'));
					presentations.doc(this.props.id).update({
						devicesConnected: doc.data().devicesConnected + 1
					});

					presentations.doc(this.props.id)
						.onSnapshot(doc => {
							this.notesContainer.innerHTML = doc.data().notes;
						});
				}

			});
	}
	
	render({ id }) {
		return (
			<div class={style.controller}>
				<h1>{this.title || 'Loading...'}</h1>
				<div class={style.notesContainer} ref={div => this.notesContainer = div} />
				<div class={style.container}>
					<div class={style.previousButton} onClick={this.previousSlide} />
					<div class={style.nextButton} onClick={this.nextSlide} />
				</div>
			</div>
		);
	}
}
