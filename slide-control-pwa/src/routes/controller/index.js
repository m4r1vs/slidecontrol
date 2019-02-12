import { h, Component } from 'preact';
import style from './style.scss';
import { route } from 'preact-router';

import lang from './languages';

const formattedSeconds = sec => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

export default class Profile extends Component {

	switchSlides = direction => {
		if (navigator.vibrate) navigator.vibrate(10);
		this.Socket.send(JSON.stringify({
			reason: direction === 'next' ? 'next-slide' : 'previous-slide'
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

				this.props.showSnackbar(
					lang.notifications.timer.started,
					null,
					2000,
					() => console.warn('App did big oopsie doopsie')
				);

			}

			else this.props.showSnackbar(
				lang.notifications.timer.resumed(formattedSeconds(this.state.secondsElapsed)),
				null,
				2000,
				() => console.warn('App did big oopsie doopsie vol. II')
			);
			
			this.incrementer = setInterval(() => {
				this.setState(state => ({ secondsElapsed: state.secondsElapsed + 1 }));
			}, 1000);

		}

		else {

			this.setState({
				timerRunning: false
			});

			this.props.showSnackbar(lang.notifications.timer.paused.msg(formattedSeconds(this.state.secondsElapsed)), lang.notifications.timer.paused.action, 3500, () => this.setState({
				secondsElapsed: 0
			}));

			clearInterval(this.incrementer);

		}
	}

	toggleLightMode = () => {
		let lightMode = !this.state.lightMode;
		this.lightModeToggle.innerHTML = lightMode ? 'brightness_2' : 'brightness_7';
		this.setState({
			lightMode
		});
		document.body.style.background = lightMode ? '#fafafa' : 'var(--background-color)';
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
		this.onKeyDown = null;
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
		try {
			this.Socket = new WebSocket(localStorage.getItem('slidecontrol-websocket-ip'));
		}
		catch (error) {
			console.error(error);
			this.props.showSnackbar(
				lang.errors.socketClosed.msg,
				lang.errors.socketClosed.action,
				4000,
				() => route('/settings')
			);
		}
		this.Socket.onopen = () => {
			this.Socket.send(JSON.stringify({
				reason: 'register-controller',
				code: this.props.id
			}));
		};
		this.Socket.onclose = () => {
			this.props.showSnackbar(
				lang.notifications.disconnected,
				null,
				1800,
				location.reload
			);
		};
	}

	componentDidMount() {

		document.getElementById('drawer').setAttribute('style', 'display: none !important');

		this.props.changeHeaderChildren(
			<i role="button" aria-label={lang.page.toggleDarkModeButton} onClick={this.toggleLightMode} ref={i => this.lightModeToggle = i} class="material-icons" style={{ userSelect: 'none', position: 'absolute', right: '7px', left: 'auto', cursor: 'pointer' }}>
				{this.state.lightMode ? 'brightness_2' : 'brightness_7'}
			</i>
		);

		this.Socket.onmessage = message => {
			message = JSON.parse(message.data);
			
			if (message.reason === 'slide-code-not-found') {
				this.props.showSnackbar(
					lang.errors.wrongCode.msg(this.props.id),
					lang.errors.wrongCode.action,
					8000,
					() => route('/')
				);
			}

			if (message.reason === 'send-slide-info') {
				this.props.showSnackbar(
					lang.notifications.synced(message.title,this.props.id),
					null,
					3500,
					() => console.warn('Wait, you were not supposed to read this, lol')
				);
				this.notesContainer.innerHTML = message.notes;
				this.props.changeHeaderTitle(`${message.title} (${message.activeSlide}/${message.totalSlides})`);
				this.setState({
					totalSlides: message.totalSlides,
					activeSlide: message.activeSlide,
					slideLoaded: true,
					title: message.title
				});
			}

			if (message.reason === 'slide-changed') {
				this.notesContainer.innerHTML = message.notes;
				this.props.changeHeaderTitle(`${this.state.title} (${message.activeSlide}/${this.state.totalSlides})`);
				this.setState({
					activeSlide: message.activeSlide
				});
			}
		};

		this.Socket.onerror = error => {
			this.props.showSnackbar(
				lang.errors.socketError.msg,
				lang.errors.socketError.action,
				5000,
				() => route('/settings')
			);
			console.error('We fucked up big here: ', error);
		};

		this.onKeyDown = key => {
			if (key.code === 'KeyT') this.startTimer();
			if (key.code === 'KeyM') this.toggleLightMode();
			if (key.code === 'ArrowLeft') this.previousSlide();
			if (key.code === 'ArrowRight' || key.code === 'Space') this.nextSlide();
		};

		document.body.addEventListener('keydown', this.onKeyDown);

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
				reason: 'laserpointer-start'
			}));
		};

		this.laserPointer.addEventListener('touchstart', this.onTouchStartPointer);

		this.onTouchMovePointer = e => {
			e.preventDefault();
			this.Socket.send(JSON.stringify({
				reason: 'laserpointer-move',
				x: e.changedTouches[0].clientX - touchstartXpointer,
				y: e.changedTouches[0].clientY - touchstartYpointer
			}));
		};

		this.laserPointer.addEventListener('touchmove', this.onTouchMovePointer);

		this.onTouchEndPointer = e => {
			e.preventDefault();
			this.Socket.send(JSON.stringify({
				reason: 'laserpointer-end'
			}));
		};

		this.laserPointer.addEventListener('touchend', this.onTouchEndPointer);
		
	}

	// clear some scheduled code when exiting component
	componentWillUnmount() {
		document.getElementById('drawer').setAttribute('style', '');
		clearInterval(this.incrementer);
		this.Socket.close();
		document.body.removeEventListener('keydown', this.onKeyDown, false);
		this.notesContainer.removeEventListener('touchstart', this.onTouchStartNotes, false);
		this.notesContainer.removeEventListener('touchend', this.onTouchEndNotes, false);
		this.laserPointer.removeEventListener('touchstart', this.onTouchStartPointer, false);
		this.laserPointer.removeEventListener('touchmove', this.onTouchMovePointer, false);
		this.laserPointer.removeEventListener('touchend', this.onTouchEndPointer, false);
	}
	
	render({ id }) {

		return (
			<div class={style.controller} ref={div => this.controller = div}>

				{/* timer */}
				{this.state.slideLoaded && (
					<span fadeIn onClick={this.startTimer} class={style.timer}>
						{this.state.secondsElapsed > 0 ? formattedSeconds(this.state.secondsElapsed) : lang.page.startTimerButton }
					</span>)
				}
				
				{/* laserpointer button */}
				{this.state.slideLoaded && (
					<span style={{ left: 'auto', right: '18px' }} fadeIn onClick={this.toggleLaserpointer} class={style.timer}>
						{this.state.laserPointer ? lang.page.showNotesButton : lang.page.showLaserpointerButton}
					</span>
				)}

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
