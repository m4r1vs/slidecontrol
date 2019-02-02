import { h } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router';

const Help = props => (
	<div class={style.help} fadeIn>
		<h1>HOW TO USE</h1>
		<p>
				Before you can use slidecontrol you need to install our Chrome Extension.
				This can be done <a href="/" target="_blank">here</a>.
		</p>
		<p>
				Once it is installed you need to open a google presentation and a button
				called "slidecontrol" should appear near the top right of the page.
		</p>
		<p>
				To open the slide just hit that button and proceed to start slidecontrol
				by clicking the button in the bottom control-bar.
		</p>
		<p>
				If everything worked as intended you should have a small code to be
				entered <Link href="/">here</Link>.
		</p>
		<h1>HOW IT WORKS</h1>
		<p>
				Slidecontrol was developed by Niels Kapeller and Marius Niveri as a project
				for German High School.
		</p>
		<p>
				Under the hood it works by utilizing the realtime
				database <a href="https://firebase.google.com/docs/firestore/">firestore</a> by
				Google. The extension creates a new entry point in there and assigns it an ID.
		</p>
		<p>
				Right after that it listens for changes in that document and changes the active
				slide by simulating a mousewheel.
		</p>
		<p>
				Once you enter the generated code in our phone-app it then is able to change the data
				in the right document in order for the Chrome Extension to switch slides.
		</p>
	</div>
);

export default Help;