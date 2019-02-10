import { h } from 'preact';
import style from './style.scss';

const AboutCode = props => (
	<div class={style.about} fadeIn>

		<section>
			<h1>The code</h1>
			<p>
				Basically slidecontrol consists of two (and a half) parts:
				<ul>
					<li>Mobile (Web) App</li>
					<li>Chrome Extension</li>
				</ul>
				Those two you should already know. They handle almost all of slidecontrols logic, too.
			</p>
			<p>
				The only thing you do not see directly is the server that is handling the communication between the app and extension.
				Everytime one wants to inform the other of something they send that something to the server and it then broadcasts it
				over to everyone involved.
			</p>
			<p>
				Because we like open-source we decided to have all of slidecontrols source hosted on GitHub:<br />
				<a href="https://github.com/m4r1vs/slidecontrol/" rel="noopener noreferrer" target="_blank">View Source</a>
			</p>
		</section>

	</div>
);

export default AboutCode;