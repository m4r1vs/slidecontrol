import { h, Component } from 'preact';
import firebase from 'firebase/app';
import 'firebase/firestore';

import style from './style.scss';
import { route } from 'preact-router';

const formattedSeconds = sec => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

export default class Profile extends Component {

	switchSlides = direction => {

		if (navigator.vibrate) navigator.vibrate(10);
		let presentations = this.db.collection('presentations');

		presentations.doc(this.props.id)
			.update({
				command: direction,
				timestamp: new Date().getTime()
			});

	}

	startTimer = () => {

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

	toggleLightMode = () => {
		let lightMode = !this.state.lightMode;
		this.setState({
			lightMode
		});
		document.body.style.background = lightMode ? '#fafafa' : '#212121';
	}

	constructor(props) {

		super(props);

		this.state = {
			totalSlides: 0,
			currentSlide: 0,
			secondsElapsed: 0,
			timerRunning: false,
			slideLoaded: false,
			lightMode: false
		};
		
		this.notes = '';
		this.onTouchStart = null;
		this.onTouchEnd = null;
		this.incrementer = null;
		this.startTimer = this.startTimer.bind(this);
		this.toggleLightMode = this.toggleLightMode.bind(this);
		this.db = firebase.firestore();
		this.nextSlide = () => this.switchSlides('next');
		this.previousSlide = () => this.switchSlides('back');
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

					if (this.notes !== doc.data().notes) this.notesContainer.innerHTML = doc.data().notes;
					
					this.title = doc.data().title;
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

					// listen for finger-move event
					this.controller.addEventListener('touchstart', this.onTouchStart);

					this.onTouchEnd = e => {

						const touchend = e.changedTouches[0];

						// Δ's
						const deltaY = Math.abs(touchend.screenY - touchstartY),
							deltaX = Math.abs(touchend.screenX - touchstartX),
							deltaT = e.timeStamp - touchstartTimestamp;

						// make sure ΔY & ΔT aren't too big and ΔX not too small
						if (deltaY > 150 || deltaT > 750 || deltaX < 80) return true;

						// gesture right-to-left and left-to-right
						if (touchstartX > touchend.screenX) this.nextSlide();
						else this.previousSlide();

					};

					// fire function above whenever finger is lifted from screen
					this.controller.addEventListener('touchend', this.onTouchEnd);

					// update notes etc. on slide change
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

	// clear some scheduled code when exiting component
	componentWillUnmount() {
		clearInterval(this.incrementer);
		this.controller.removeEventListener('touchstart', this.onTouchStart, false);
		this.controller.removeEventListener('touchend', this.onTouchEnd, false);
	}
	
	render({ id }) {

		document.querySelector('meta[name=theme-color]')
			.setAttribute('content', '#ffbc16');

		return (
			<div class={style.controller} ref={div => this.controller = div}>

				{/* timer */}
				{this.state.slideLoaded && (
					<span fadeIn onClick={this.startTimer} class={style.timer}>
						{this.state.secondsElapsed > 0 ? formattedSeconds(this.state.secondsElapsed) : 'start timer' }
					</span>)
				}

				{/* header */}
				<h1>
					<i onClick={this.goHome} class="material-icons">home</i>
					{this.title || 'Loading...'} {this.state.currentSlide}/{this.state.totalSlides}
					<i onClick={this.toggleLightMode} class="material-icons" style={{ right: '7px', left: 'auto' }}>
						{this.state.lightMode ? 'brightness_7' : 'brightness_2'}
					</i>
				</h1>

				{/* Notes */}
				<div
					fadeIn
					class={style.notesContainer}
					light={this.state.lightMode}
					ref={div => this.notesContainer = div}
				/>

				{/* Next/Previous slide buttons */}
				{this.state.slideLoaded && <div>
					<div class={style.container}>
						<div class={style.previousButton} onClick={this.previousSlide} />
						<div class={style.nextButton} onClick={this.nextSlide} />
					</div></div>}

			</div>
		);
	}
}
