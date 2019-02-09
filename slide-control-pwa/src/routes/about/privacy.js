import { h } from 'preact';
import style from './style.scss';

const AboutPrivacy = props => (
	<div class={style.about} fadeIn>

		<section path="/about/privacy">
			<h1>Privacy</h1>
			<p>
				We do not track a lot about you. But in order to make slidecontrol work we need to temporaraly have your slide's notes, title
				and position to be accessed. However they only live in our servers RAM until you close your connection from the computer.
			</p>
			<p>
				You can also <a href="https://github.com/m4r1vs/slidecontrol/" rel="noopener noreferrer" target="_blank">visit our GitHub</a> to get further insight
				in what exactly goes on under the hood if you are curious of course.
			</p>
			<p>
				Otherwise do also have the small website analytics tool
				tracker <a href="https://ticksel.com/" rel="noopener noreferrer" target="_blank">ticksel.com</a> in place.
				It only tracks how long you are on slidecontrol and from what city you visit us by IP address. If you want to see the
				script, <a href="/assets/analytics.js" target="_blank">here</a> you go.
			</p>
			<p>
				But if you don't feel like we should know you exist, you can turn on the Do-Not-Track setting in your Browser of choice
				and you are good. <a href="https://allaboutdnt.com/" rel="noopener noreferrer" target="_blank">Here</a> you can learn how to do so.
			</p>
		</section>

	</div>
);

export default AboutPrivacy;