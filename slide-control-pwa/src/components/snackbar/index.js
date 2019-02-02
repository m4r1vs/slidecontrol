import { h, Component } from 'preact';

import style from './style.scss';

export default class Snackbar extends Component {

	render({ text, actionText, clickAction }) {

		return (
			<div
				ref={el => this.snackbarElement = el}
				style={{ transform: (text) ? 'translateY(0%)' : 'translateY(200%)' }}
				class={style.snackbar}
			>
				
				{/* Text shown in Snackbar */}
				<span>{(text) ? text : null}</span>

				{/* Optional Snackbar Action-button */}
				<button onClick={clickAction}>
					{(actionText) ? actionText : null}
				</button>
			</div>
		);
	}
}