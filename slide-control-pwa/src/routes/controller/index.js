import { h, Component } from 'preact';

import style from './style.scss';
import { route } from 'preact-router';

const formattedSeconds = sec => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

export default class Profile extends Component {

	switchSlides = direction => {
		if (navigator.vibrate) navigator.vibrate(10);
		this.Socket.send(JSON.stringify({
			reason: direction === 'next' ? 'next-slide' : 'previous-slide',
			code: this.props.id
		}));

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

	toggleLaserpointer = () => {
		let laserPointer = !this.state.laserPointer;
		this.setState({
			laserPointer
		});
	}

	constructor(props) {

		super(props);

		this.state = {
			totalSlides: 0,
			activeSlide: 0,
			secondsElapsed: 0,
			title: null,
			timerRunning: false,
			slideLoaded: false,
			lightMode: false,
			laserPointer: false
		};

		window.WebSocket = window.WebSocket || window.MozWebSocket;
		this.Socket = null;
		this.notes = '';
		this.onTouchStartNotes = null;
		this.onTouchEndNotes = null;
		this.onTouchStartPointer = null;
		this.onTouchMovePointer = null;
		this.onTouchEndPointer = null;
		this.incrementer = null;
		this.startTimer = this.startTimer.bind(this);
		this.toggleLightMode = this.toggleLightMode.bind(this);
		this.toggleLaserpointer = this.toggleLaserpointer.bind(this);
		this.nextSlide = () => this.switchSlides('next');
		this.previousSlide = () => this.switchSlides('back');
		this.goHome = () => route('/');

	}

	componentWillMount() {
		this.Socket = new WebSocket('wss://www.maniyt.de:61263');
		this.Socket.onopen = () => {
			this.Socket.send(JSON.stringify({
				reason: 'register-controller',
				code: this.props.id
			}));
		};
	}

	componentDidMount() {

		this.Socket.onmessage = message => {
			message = JSON.parse(message.data);
			
			if (message.reason === 'slide-code-not-found') {
				this.props.showSnackbar(
					`You just did a big oopsie doopsie, cz the code you entered (${this.props.id}) is invalid.`,
					'FUCK, GO BACK!',
					8000,
					() => route('/')
				);
			}

			if (message.reason === 'send-slide-info') {
				this.props.showSnackbar(`Synced to "${message.title}" (#${this.props.id})`, null, 3500, () => console.log('Hey there :)'));
				this.notesContainer.innerHTML = message.notes;
				this.setState({
					totalSlides: message.totalSlides,
					activeSlide: message.activeSlide,
					slideLoaded: true,
					title: message.title
				});
			}

			if (message.reason === 'slide-changed') {
				this.notesContainer.innerHTML = message.notes;
				this.setState({
					activeSlide: message.currentSlide
				});
			}
		};

		this.Socket.onerror = error => console.error(error);

		let touchstartXnotes = 0;
		let touchstartYnotes = 0;
		let touchstartTimestamp = 0;

		this.onTouchStartNotes = e => {
			touchstartXnotes = e.changedTouches[0].screenX;
			touchstartYnotes = e.changedTouches[0].screenY;
			touchstartTimestamp = e.timeStamp;
		};

		// listen for finger-move event
		this.notesContainer.addEventListener('touchstart', this.onTouchStartNotes);

		this.onTouchEndNotes = e => {

			const touchend = e.changedTouches[0];

			// Δ's
			const deltaY = Math.abs(touchend.screenY - touchstartYnotes),
				deltaX = Math.abs(touchend.screenX - touchstartXnotes),
				deltaT = e.timeStamp - touchstartTimestamp;

			// make sure ΔY & ΔT aren't too big and ΔX not too small
			if (deltaY > 150 || deltaT > 750 || deltaX < 80) return true;

			// gesture right-to-left and left-to-right
			if (touchstartXnotes > touchend.screenX) this.nextSlide();
			else this.previousSlide();

		};

		// fire function above whenever finger is lifted from screen
		this.notesContainer.addEventListener('touchend', this.onTouchEndNotes);

		let touchstartXpointer = 0;
		let touchstartYpointer = 0;

		this.onTouchStartPointer = e => {
			e.preventDefault();
			touchstartXpointer = e.changedTouches[0].clientX,
			touchstartYpointer = e.changedTouches[0].clientY,

			this.Socket.send(JSON.stringify({
				reason: 'laserpointer-start',
				code: this.props.id
			}));
		};

		this.laserPointer.addEventListener('touchstart', this.onTouchStartPointer);

		this.onTouchMovePointer = e => {
			e.preventDefault();
			this.Socket.send(JSON.stringify({
				reason: 'laserpointer-move',
				code: this.props.id,
				x: e.changedTouches[0].clientX - touchstartXpointer,
				y: e.changedTouches[0].clientY - touchstartYpointer
			}));
		};

		this.laserPointer.addEventListener('touchmove', this.onTouchMovePointer);

		this.onTouchEndPointer = e => {
			e.preventDefault();
			this.Socket.send(JSON.stringify({
				reason: 'laserpointer-end',
				code: this.props.id
			}));
		};

		this.laserPointer.addEventListener('touchend', this.onTouchEndPointer);
		
	}

	// clear some scheduled code when exiting component
	componentWillUnmount() {
		clearInterval(this.incrementer);
		this.Socket.close();
		this.notesContainer.removeEventListener('touchstart', this.onTouchStartNotes, false);
		this.notesContainer.removeEventListener('touchend', this.onTouchEndNotes, false);
		this.laserPointer.removeEventListener('touchstart', this.onTouchStartPointer, false);
		this.laserPointer.removeEventListener('touchmove', this.onTouchMovePointer, false);
		this.laserPointer.removeEventListener('touchend', this.onTouchEndPointer, false);
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
					{this.state.title || 'Loading...'} {this.state.activeSlide}/{this.state.totalSlides}
					<i onClick={this.toggleLaserpointer} class="material-icons" style={{ right: '38px', left: 'auto' }}>
						{this.state.laserPointer ? 'notes' : 'touch_app'}
					</i>
					<i onClick={this.toggleLightMode} class="material-icons" style={{ right: '7px', left: 'auto' }}>
						{this.state.lightMode ? 'brightness_7' : 'brightness_2'}
					</i>
				</h1>

				{/* Notes */}
				<div
					fadeIn
					style={{ display: !this.state.laserPointer ? 'block' : 'none' }}
					class={style.notesContainer}
					light={this.state.lightMode}
					ref={div => this.notesContainer = div}
				/>

				{/* laserpointer */}
				<div
					style={{ display: this.state.laserPointer ? 'block' : 'none' }}
					class={style.laserPointer}
					light={this.state.lightMode}
					ref={div => this.laserPointer = div}
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
