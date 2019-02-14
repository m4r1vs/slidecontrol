import { h } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router/match';

const About = props => (
	<div class={style.aboutList} fadeIn>

		<Link href="/about/us">
			About Us<br />
			<span>
				Learn more about how and by whom slidecontrol was developed.
			</span>
		</Link>

		<Link href="/about/code">
			Our code<br />
			<span>
				Get some insights into the code working behind the scenes.
			</span>
		</Link>

		<Link href="/about/credits">
			Who we depend on<br />
			<span>
				Projects used for slidecontrol we want to give special credits to.
			</span>
		</Link>

		<Link href="/about/privacy">
			Your Privacy<br />
			<span>
				Your privacy should be important to you. Know what we know.
			</span>
		</Link>

		<Link href="/about/licenses">
			Open-Source Licenses<br />
			<span>
				Our license and the complete list of open-source projects we use and their licenses
			</span>
		</Link>

		<a href="https://github.com/m4r1vs/slidecontrol" rel="noopener noreferrer" target="_blank">
			slidecontrol app<br />
			<span>Version {window.SLIDECONTROL.version}</span>
		</a>

	</div>
);

export default About;