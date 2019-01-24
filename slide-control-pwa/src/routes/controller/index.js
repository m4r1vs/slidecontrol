import { h, Component } from 'preact';
import firebase from 'firebase/app';
import 'firebase/firestore';

import Button from '../../components/buttons';

import style from './style.scss';

export default class Profile extends Component {
	
	nextSlide() {
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).get()
			.then(doc => {
				presentations.doc(this.props.id).set({
					activeSlide: doc.data().activeSlide + 1
				});
			});
	}

	previousSlide() {
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).get()
			.then(doc => {
				presentations.doc(this.props.id).set({
					activeSlide: doc.data().activeSlide - 1
				});
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
