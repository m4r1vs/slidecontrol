import { h } from 'preact';
import style from './style.scss';

export const DoughnutIcon = ({ title }) => (

	<svg
		class={style.icon}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 64 64"
		ariaLabelledby="title"
		ariaDescribedby="desc"
		role="img"
	>
		<title>{title}</title>
		<desc>A color styled icon from Orion Icon Library.</desc>
		<path data-name="layer2" class="applyHoverEffect"
			d="M32 62a30 30 0 0 0 26.6-16.2C50 42 49.2 50.6 46 50s-4.2-3.3-6-.4-4.7 3-7.9 2.4-3.4.7-6.3 2-7.1-1.2-5.8-6-4.7-5.1-6-2-2.2 5.6-4 5.9h-.4A29.9 29.9 0 0 0 32 62z"
			fill="#de9d63"
		/>
		<path data-name="layer1" class="applyHoverEffect" d="M32 2A30 30 0 0 0 9.6 52h.4c1.9-.3 2.8-2.8 4-5.9s7.2-2.6 6 2 2.9 7.3 5.8 6 3.1-2.6 6.3-2 6.1.5 7.9-2.4 2.8-.2 6 .4 4-8 12.6-4.2A30 30 0 0 0 32 2zm0 40a10 10 0 1 1 10-10 10 10 0 0 1-10 10z"
			fill="#f5a4c4"
		/>
		<path data-name="opacity" class="applyHoverEffect" d="M20 36a10 10 0 0 0 19.7 2.4 10 10 0 0 1-17.4-8.8A10 10 0 0 0 20 36zM32 2A30 30 0 0 0 4.2 20.6a30 30 0 0 1 54.2 25.1h.3A30 30 0 0 0 32 2z"
			fill="#fff" opacity=".25"
		/>
		<circle data-name="stroke" cx="32" cy="32" r="30" fill="none" stroke="#ffbc16"
			stroke-linecap="round" stroke-linejoin="miter" stroke-width="2"
		/>
		<circle data-name="stroke" cx="32" cy="32" r="10" fill="none"
			stroke="#ffbc16" stroke-linecap="round" stroke-linejoin="miter" stroke-width="2"
		/>
		<path data-name="stroke" d="M10 51.9c1.9-.3 2.8-2.8 4-5.9s7.2-2.6 6 2 2.9 7.3 5.8 6 3.1-2.6 6.3-2 6.1.5 7.9-2.4 2.8-.2 6 .4 4-8 12.6-4.2M18 14l4 4m-8 8l-4 4m2 8h4m10-28h8m10 4l-4 4m10 6l4 2m-4 8v4"
			fill="none" stroke="#ffbc16" stroke-linecap="round" stroke-linejoin="miter"
			stroke-width="2"
		/>
	</svg>

);

export const BeerIcon = ({ title }) => (

	<svg class={style.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
		aria-describedby="desc" role="img"
	>
		<title>{title}</title>
		<desc>A color styled icon from Orion Icon Library.</desc>
		<path data-name="layer3" class="applyHoverEffect"
			d="M44 7.8a7.9 7.9 0 0 0-2.3.4 6 6 0 0 0-9.1-3.1A11 11 0 0 0 15.2 8H15a9 9 0 0 0-3 17.5V22h36v.7a8 8 0 0 0-4-14.9z"
			fill="#fbe9c7"
		/>
		<path data-name="layer2" class="applyHoverEffect" d="M48 50h4a6 6 0 0 0 6-6V32a6 6 0 0 0-6-6h-4v4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4z"
			fill="#d5e2f4"
		/>
		<path data-name="layer1" class="applyHoverEffect" d="M12 22v37a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V22z"
			fill="#f4d44d"
		/>
		<path data-name="opacity" class="applyHoverEffect" d="M34 22v37a3 3 0 0 1-3 3h7a3 3 0 0 0 3-3V22z"
			fill="#fff" opacity=".5"
		/>
		<path data-name="opacity" class="applyHoverEffect" d="M20 59V22h-8v37a3 3 0 0 0 3 3h8a3 3 0 0 1-3-3z"
			fill="#101129" opacity=".25"
		/>
		<path data-name="stroke" d="M48 22v37a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V22zM30 32v20M20 32v20m20-20v20m8-26h4a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-4"
			fill="none" stroke="#ffbc16" stroke-linecap="round" stroke-linejoin="miter"
			stroke-width="2"
		/>
		<path data-name="stroke" d="M48 46h4a2 2 0 0 0 2-2V32a2 2 0 0 0-2-2h-4m0-7.3a8 8 0 0 0-4-14.9 7.9 7.9 0 0 0-2.3.4 6 6 0 0 0-9.1-3.1A11 11 0 0 0 15.2 8H15a9 9 0 0 0-3 17.5"
			fill="none" stroke="#ffbc16" stroke-linecap="round" stroke-linejoin="miter"
			stroke-width="2"
		/>
	</svg>

);

export const BrushIcon = ({ title }) => (
	
	<svg class={style.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
		aria-describedby="desc" role="img"
	>
		<title>{title}</title>
		<desc>A color styled icon from Orion Icon Library.</desc>
		<path data-name="layer3" class="applyHoverEffect"
			d="M61.5 3.2a1.8 1.8 0 0 0-2.3-.2h-.1C37.9 18.8 27.9 28.1 20.6 35.4l8.6 8.7c7.3-7.3 16.6-17.3 32.4-38.5h.1a1.8 1.8 0 0 0-.2-2.4z"
			fill="#ed4c49"
		/>
		<path data-name="layer2" class="applyHoverEffect" d="M18 38a6.1 6.1 0 0 0 8.7 8.7l2.6-2.6-8.6-8.7z"
			fill="#bacae9"
		/>
		<path data-name="opacity" class="applyHoverEffect" d="M61.4 3.2a1.8 1.8 0 0 0-.9-.5C44.8 23.8 35.4 33.7 28.2 41l-1 1 2 2c7.3-7.3 16.6-17.3 32.4-38.5h.1a1.8 1.8 0 0 0-.3-2.3zM25.6 43.7a6.1 6.1 0 0 1-8.7 0l-.8-.9a6.1 6.1 0 0 0 10.4 3.9l2.6-2.6-2-2z"
			fill="#000028" opacity=".15"
		/>
		<path data-name="layer1" class="applyHoverEffect" d="M18.3 55.5A6 6 0 0 0 9.8 47C5.5 51.2 7 59.9 2 61.4c4.7-.3 11.5-1.1 16.3-5.9z"
			fill="#536897"
		/>
		<path data-name="stroke" d="M61.5 3.2a1.8 1.8 0 0 0-2.3-.2h-.1C37.9 18.8 27.9 28.1 20.6 35.4l8.6 8.7c7.3-7.3 16.6-17.3 32.4-38.5h.1a1.8 1.8 0 0 0-.2-2.4z"
			fill="none" stroke="#ffbc18" stroke-linecap="round" stroke-linejoin="miter"
			stroke-width="2"
		/>
		<path data-name="stroke" d="M18 38a6.1 6.1 0 0 0 8.7 8.7l2.6-2.6-8.6-8.7z"
			fill="none" stroke="#ffbc18" stroke-linecap="round" stroke-linejoin="miter"
			stroke-width="2"
		/>
		<path data-name="stroke" d="M18.3 55.5A6 6 0 0 0 9.8 47C5.5 51.2 7 59.9 2 61.4c4.7-.3 11.5-1.1 16.3-5.9z"
			fill="none" stroke="#ffbc18" stroke-linecap="round" stroke-linejoin="miter"
			stroke-width="2"
		/>
	</svg>

);

export const ChickenIcon = ({ title }) => (

	<svg class={style.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
		aria-describedby="desc" role="img"
	>
		<title>{title}</title>
		<desc>A color styled icon from Orion Icon Library.</desc>
		<path data-name="layer3" class="applyHoverEffect"
			d="M13 44.5l-4.3 4.3a4.1 4.1 0 0 0-5.5 6.1c2.1 2.1 2.9 1.5 3.7 2.2s.4 1.9 2.2 3.7a4.1 4.1 0 0 0 5.9-5.9l-.3-.2 4.3-4.3"
			fill="#fff4e8"
		/>
		<path data-name="layer2" class="applyHoverEffect" d="M55.9 8.2a21 21 0 0 0-29.7 0l-1.6 1.7-.3.4-1 1.3c-6.2 9.3-6.7 23.1-9.2 25.6l-.7.7a5 5 0 0 0 0 7.1l5.7 5.7a5 5 0 0 0 7.1 0l.7-.7c2.7-2.7 17.5-2.4 27.3-10.5l1.6-1.5a21 21 0 0 0 .1-29.8z"
			fill="#faa85e"
		/>
		<path data-name="opacity" class="applyHoverEffect" d="M55.8 8.2c6.2 6.2 4.7 18-3.5 26.2l-1.6 1.5c-9.6 8.3-22.7 9.8-25.4 12.5l-.7.7c-2 2-4.7 2.3-6.2.8l-2.2-2.2 2.8 2.8a5 5 0 0 0 7.1 0l.7-.7c2.7-2.7 17.5-2.4 27.3-10.5l1.6-1.5a21 21 0 0 0 .1-29.6z"
			fill="#101129" opacity=".18"
		/>
		<ellipse data-name="opacity" class="applyHoverEffect" cx="43" cy="10" rx="5" ry="4"
			fill="#fff"
			opacity=".25"
		/>
		<circle data-name="layer1" class="applyHoverEffect" cx="44" cy="10" r="1" fill="#f78e2e" />
		<circle data-name="layer1" class="applyHoverEffect" cx="36" cy="12" r="1" fill="#f78e2e" />
		<circle data-name="layer1" class="applyHoverEffect" cx="46" cy="18" r="1" fill="#f78e2e" />
		<path data-name="stroke" d="M13 44.5l-4.3 4.3a4.1 4.1 0 0 0-5.5 6.1c2.1 2.1 2.9 1.5 3.7 2.2s.4 1.9 2.2 3.7a4.1 4.1 0 0 0 5.9-5.9l-.3-.2 4.3-4.3"
			fill="none" stroke="#ffbc16" stroke-linecap="round" stroke-linejoin="miter"
			stroke-width="2"
		/>
		<path data-name="stroke" d="M55.9 8.2a21 21 0 0 0-29.7 0l-1.6 1.7-.3.4-1 1.3c-6.2 9.3-6.7 23.1-9.2 25.6l-.7.7a5 5 0 0 0 0 7.1l5.7 5.7a5 5 0 0 0 7.1 0l.7-.7c2.7-2.7 17.5-2.4 27.3-10.5l1.6-1.5a21 21 0 0 0 .1-29.8z"
			fill="none" stroke="#ffbc16" stroke-linecap="round" stroke-linejoin="miter"
			stroke-width="2"
		/>
		<circle data-name="stroke" cx="44" cy="10" r="1" fill="none" stroke="#ffbc16"
			stroke-linecap="round" stroke-linejoin="miter" stroke-width="2"
		/>
		<circle data-name="stroke" cx="36" cy="12" r="1" fill="none"
			stroke="#ffbc16" stroke-linecap="round" stroke-linejoin="miter" stroke-width="2"
		/>
		<circle data-name="stroke" cx="46" cy="18" r="1" fill="none"
			stroke="#ffbc16" stroke-linecap="round" stroke-linejoin="miter" stroke-width="2"
		/>
	</svg>

);

export const PizzaIcon = ({ title }) => (

	<svg class={style.icon} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title"
		aria-describedby="desc" role="img"
	>
		<title>{title}</title>
		<desc>A color styled icon from Orion Icon Library.</desc>
		<path fill="#faf287" class="applyHoverEffect"
			d="M22.473 9.3L7 54l42.978-18.91C44.833 23.128 34.618 14.087 22.473 9.3z"
			data-name="layer3"
		/>
		<circle fill="#f04848" class="applyHoverEffect" r="4" cy="23.999" cx="28.999" data-name="layer2" />
		<circle fill="#f04848" class="applyHoverEffect" r="2" cy="33.999" cx="34.999" data-name="layer2" />
		<circle fill="#f04848" class="applyHoverEffect" r="2.5" cy="37.499" cx="20.999" data-name="layer2" />
		<path fill="#f6b36d" class="applyHoverEffect" d="M25 2l-2.527 7.3c12.145 4.787 22.36 13.828 27.507 25.787L57 32C51.011 18.087 39.13 7.567 25 2z"
			data-name="layer1"
		/>
		<path opacity=".18" class="applyHoverEffect" fill="#101129" d="M51.981 33.087C46.835 21.128 36.62 12.085 24.475 7.3l1.668-4.818C25.761 2.321 25.384 2.153 25 2l-2.527 7.3c12.145 4.787 22.36 13.828 27.507 25.787L57 32c-.136-.314-.29-.619-.432-.93z"
			data-name="opacity"
		/>
		<circle stroke-width="2" stroke-linejoin="miter" stroke-linecap="round"
			stroke="#ffbc16" fill="none" r="4" cy="23.999" cx="28.999" data-name="stroke"
		/>
		<circle stroke-width="2" stroke-linejoin="miter" stroke-linecap="round"
			stroke="#ffbc16" fill="none" r="2" cy="33.999" cx="34.999" data-name="stroke"
		/>
		<circle stroke-width="2" stroke-linejoin="miter" stroke-linecap="round"
			stroke="#ffbc16" fill="none" r="2.5" cy="37.499" cx="20.999" data-name="stroke"
		/>
		<path stroke-width="2" stroke-linejoin="miter" stroke-linecap="round"
			stroke="#ffbc16" fill="none" d="M22.473 9.3L7 54l42.978-18.91C44.833 23.128 34.618 14.087 22.473 9.3z"
			data-name="stroke"
		/>
		<path stroke-width="2" stroke-linejoin="miter" stroke-linecap="round"
			stroke="#ffbc16" fill="none" d="M49.979 35.087L57 32C51.011 18.087 39.13 7.567 25 2l-2.527 7.3m-5.474 40.299v8.4m8-11.92v15.92m16-22.933v12.933"
			data-name="stroke"
		/>
	</svg>

);