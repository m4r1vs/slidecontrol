import { h } from 'preact';
import style from './style.scss';

const About = props => (
	<div class={style.about} fadeIn>
		
		<section>
			<h1>We and our vision</h1>
			<p>
			We are Marius Niveri and Niels Kapeller.
			We are both students from Hamburg, Germany. Currently visiting the 11th grade of a physics class,
			we realized, how often we are given the assignment to create a presentation.
			</p>
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

		<section>
			<h1 style={{ fontFamily: 'Consolas, monospaced' }}>The code</h1>
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

		<section>
			<h1>
			Who we depend on
			</h1>
			<p>
			We decided to dedicate this section to the projects we are using and used to create slidecontrol:
			</p>
			<h2>Uberspace</h2>
			<p>
			The amazing people over
			at <a href="https://uberspace.de/" rel="noopener noreferrer" target="_blank">Uberspace.de</a> are enabling
			us and many other people around the world to have highly customizable Linux servers on a budget.
			</p>
			<p>
			We are having our nodeJS WebSocket server hosted there on asteroids.
			</p>
			<h2>Firebase</h2>
			<p>
			We also make use of Google's mostly
			free <a href="https://en.wikipedia.org/wiki/Firebase" rel="noopener noreferrer" target="_blank">firebase</a> service.
			It allows us to host our mobile app with HTTPS enabled by default and easy updates of code.
			</p>
			<h2>Preact</h2>
			<p>
			Of course we are also very thankful	for the people behind the libraries/frameworks we use. The most notable one
			being <a href="https://github.com/developit/preact" rel="noopener noreferrer" target="_blank">Preact</a> created
			by <a href="https://github.com/developit" rel="noopener noreferrer" target="_blank">Jason Miller</a>.
			</p>
			<h2>You :)</h2>
			<p>
			And finally, if you weren't there to use our app we would probably lack lots of motivation to continue our work
			on slidecontrol.
			</p>
			<p>
			Thanks!
			</p>
		</section>

		<section>
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

export default About;