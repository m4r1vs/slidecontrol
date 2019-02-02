import { h, Component } from 'preact';
import firebase from 'firebase/app';
import 'firebase/firestore';

import style from './style.scss';
import { route } from 'preact-router';

const formattedSeconds = sec => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

export default class Profile extends Component {
	
	nextSlide() {
		navigator.vibrate(10);
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).update({
			command: 'next',
			timestamp: new Date().getTime()
		});
	}

	previousSlide() {
		navigator.vibrate(10);
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
				this.props.showSnackbar('Started new timer for you', null, 2000, () => console.log('App did big oopsie doopsie'));
			}
			else this.props.showSnackbar(`Resumed timer for you at ${formattedSeconds(this.state.secondsElapsed)}`, null, 2000, () => console.log('App did big oopsie doopsie vol. II'));
			this.incrementer = setInterval(() => {
				this.setState(state => ({ secondsElapsed: state.secondsElapsed + 1 }));
			}, 1000);

		}
		else {
			this.setState({
				timerRunning: false
			});
			this.props.showSnackbar(`Paused timer for you at ${formattedSeconds(this.state.secondsElapsed)}`, 'RESET IT', 3500, () => this.setState({
				secondsElapsed: 0
			}));
			clearInterval(this.incrementer);
		}
	}

	constructor(props) {

		super(props);

		this.state = {
			totalSlides: 0,
			currentSlide: 0,
			secondsElapsed: 0,
			timerRunning: false,
			slideLoaded: false
		};
		
		this.notes = '';
		this.onTouchStart = null;
		this.onTouchEnd = null;
		this.incrementer = null;
		this.startTimer = this.startTimer.bind(this);
		this.db = firebase.firestore();
		this.nextSlide = this.nextSlide.bind(this);
		this.previousSlide = this.previousSlide.bind(this);
		this.goHome = () => route('/');

	}

	componentDidMount() {
		const presentations = this.db.collection('presentations');
		presentations.doc(this.props.id).get()
			.then(doc => {

				if (!doc.exists) {
					this.props.showSnackbar(`You just did a big oopsie doopsie, cz the code you entered (${this.props.id}) is invalid.`, 'FUCK, GO BACK!', 8000, () => route('/'));
				}
				else {
					this.setState({
						slideLoaded: true
					});

					this.title = doc.data().title;
					if (this.notes !== doc.data().notes) this.notesContainer.innerHTML = doc.data().notes;
					this.notes = doc.data().notes;
					this.props.showSnackbar(`Synced to "${this.title}" (#${this.props.id})`, null, 3500, () => console.log('Hey there :)'));
					presentations.doc(this.props.id).update({
						devicesConnected: doc.data().devicesConnected + 1
					});
					
					let touchstartX = 0;
					let touchstartY = 0;
					let touchstartTimestamp = 0;

					this.onTouchStart = e => {
						touchstartX = e.changedTouches[0].screenX;
						touchstartY = e.changedTouches[0].screenY;
						touchstartTimestamp = e.timeStamp;
					};
					this.controller.addEventListener('touchstart', this.onTouchStart);

					this.onTouchEnd = e => {
						if ((e.timeStamp - touchstartTimestamp) > 750) return true;
						if (Math.abs(touchstartY - e.changedTouches[0].screenY) > 150) return true;

						if (touchstartX > e.changedTouches[0].screenX) {
							if ((touchstartX - e.changedTouches[0].screenX) > 80) this.nextSlide();
						}
						if (touchstartX < e.changedTouches[0].screenX) {
							if ((e.changedTouches[0].screenX - touchstartX) > 80) this.previousSlide();
						}
					};
					this.controller.addEventListener('touchend', this.onTouchEnd);

					presentations.doc(this.props.id)
						.onSnapshot(doc => {
							if (this.notes !== doc.data().notes) this.notesContainer.innerHTML = doc.data().notes;
							this.notes = doc.data().notes;
							this.setState({
								totalSlides: doc.data().totalSlides,
								currentSlide: doc.data().position
							});
						});
				}

			});
	}

	componentWillUnmount() {
		clearInterval(this.incrementer);
		this.controller.removeEventListener('touchstart', this.onTouchStart, false);
		this.controller.removeEventListener('touchend', this.onTouchEnd, false);
	}
	
	render({ id }) {
		return (
			<div class={style.controller} ref={div => this.controller = div}>
				{this.state.slideLoaded && <span fadeIn onClick={this.startTimer} class={style.timer}>{this.state.secondsElapsed > 0 ? formattedSeconds(this.state.secondsElapsed) : 'start timer' }</span>}
				<h1><i onClick={this.goHome} class="material-icons">home</i>{this.title || 'Loading...'} {this.state.currentSlide}/{this.state.totalSlides}</h1>
				<div fadeIn class={style.notesContainer} ref={div => this.notesContainer = div} />
				{this.state.slideLoaded && <div>
					<div class={style.container}>
						<div class={style.previousButton} onClick={this.previousSlide} />
						<div class={style.nextButton} onClick={this.nextSlide} />
					</div></div>}
			</div>
		);
	}
}
