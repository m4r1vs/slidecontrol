import { h, Component } from 'preact';
import firebase from 'firebase/app';
import 'firebase/firestore';

import style from './style.scss';
import { route } from 'preact-router';

const formattedSeconds = sec => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

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

	startTimer() {
		if (!this.state.timerRunning) {
			this.setState({
				timerRunning: true
			});
			if (this.state.secondsElapsed === 0) {
				this.setState({
					secondsElapsed: 1
				});
			}
			this.incrementer = setInterval(() => {
				this.setState(state => ({ secondsElapsed: state.secondsElapsed + 1 }));
			}, 1000);
		}
		else {
			this.setState({
				timerRunning: false
			});
			clearInterval(this.incrementer);
		}
	}

	constructor(props) {

		super(props);

		this.state = {
			totalSlides: 0,
			currentSlide: 0,
			secondsElapsed: 0,
			timerRunning: false
		};
		
		this.incrementer = null;
		this.startTimer = this.startTimer.bind(this);
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
							this.setState({
								totalSlides: doc.data().totalSlides,
								currentSlide: doc.data().position
							});
						});
				}

			});
	}
	
	render({ id }) {
		return (
			<div class={style.controller}>
				<span onClick={this.startTimer} class={style.timer}>{this.state.secondsElapsed > 0 ? formattedSeconds(this.state.secondsElapsed) : 'start timer' }</span>
				<h1>{this.title || 'Loading...'} {this.state.currentSlide}/{this.state.totalSlides}</h1>
				<div class={style.notesContainer} ref={div => this.notesContainer = div} />
				<div class={style.container}>
					<div class={style.previousButton} onClick={this.previousSlide} />
					<div class={style.nextButton} onClick={this.nextSlide} />
				</div>
			</div>
		);
	}
}
