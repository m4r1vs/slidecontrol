import { h } from 'preact';
import style from './style.scss';

const AboutUs = props => (
	<div class={style.about} fadeIn>

		<section>
			<h1>We and our vision</h1>
			<p>
				We are Marius Niveri and Niels Kapeller.
				We are both students from Hamburg, Germany. Currently visiting the 11th grade of a physics class,
				we realized, how often we are given the assignment to create a presentation.
			</p>
			<img src="/assets/about_art.svg" />
			<p>
				Since this can be a rather difficult task, we thought about making it easier.
				Most of the presentation software is already advanced and quite often even free.
			</p>
			<p>
				So we decided not to focus on the slides but on the way we present them.
				This is how slidecontrol was created. Use slidecontrol to easily present slides in class, at work or just for the presentation's sake.
			</p>
			<p>
				Just use your phone as the remote.
			</p>
		</section>

	</div>
);

export default AboutUs;