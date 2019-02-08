import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style.scss';

import QrScanner from 'qr-scanner';
QrScanner.WORKER_PATH = '/assets/qr-scanner-worker.js';

export default class Scanner extends Component {

	scanCode() {

		this.props.showSnackbar(
			'Scanner started',
			null,
			2000,
			() => console.warn('woopsie')
		);

		this.scanner = new QrScanner(this.video, result => {
			if (result.split('/')[0] !== 'slide-control-firebase.firebaseapp.com' || result.split('/')[1] !== 'controller') this.props.showSnackbar(
				'Scanned code not readable: "' + result + '"',
				null,
				3500,
				() => console.warn('wait what')
			);
			else if (result.split('/')[2] && !isNaN(parseInt(result.split('/')[2], 10))) {
				this.scanner.stop();
				route(`/controller/${parseInt(result.split('/')[2], 10)}`);
			}
		});
		this.scanner.setInversionMode('invert');
		this.scanner.start();
	}

	componentDidMount() {
		if (!window.Worker) this.props.showSnackbar(
			'Seems like your browser does not support WebWorkers, hence cannot read QR codes',
			'BACK',
			7000,
			() => route('/')
		);
		else QrScanner.hasCamera().then(hasCamera => hasCamera ? this.scanCode() : this.props.showSnackbar(
			'Seems like your device has no camera to be accessed',
			'BACK',
			4500,
			() => route('/')
		));
	}

	componentWillUnmount() {
		if (this.scanner) this.scanner.stop();
	}

	render() {
		return (
			<div class={style.scanner}>
				<video muted playsinline ref={video => this.video = video} />
			</div>
		);
	}
}