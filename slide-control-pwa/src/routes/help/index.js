import { h } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router';

const Help = props => (
	<div class={style.help} fadeIn>

		<h1>HOW TO USE</h1>
		<p>
			Before you can use slidecontrol you need to install our Chrome Extension.
			This can be done <a href="https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg" rel="noopener noreferrer" target="_blank">here</a>.
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
			Under the hood it works by establishing a connection based on WebSockets to a small server
			we are hosting. The server connects both app and extension by entered/generated ID and forwards
			commands send from either to the other in realtime.
		</p>
		
	</div>
);

export default Help;