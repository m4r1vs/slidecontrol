(function () {
	if (!this.JSON) {
		this.JSON = {};
	}

	let tojson = JSON.stringify;

	function getReferrer() {
		let referrer = '';
		try {
			referrer = window.top.document.referrer;
		}
		catch (e) {
			if (window.parent) {
				try {
					referrer = window.parent.document.referrer;
				}
				catch (e2) {
					referrer = '';
				}
			}
		}
		if (referrer === '') {
			referrer = document.referrer;
		}
		if (typeof referrer === 'undefined') {
			referrer = '';
		}
		return referrer;
	}
	let jsonConfig = '{}';
	let image = new Image(1, 1);
	let referrer = getReferrer();
	window._tcfg.push(['referrer', referrer]);
	if (undefined !== window._tcfg && window._tcfg.length) {
		jsonConfig = tojson(window._tcfg);
	}
	image.src = 'https://beacon.ticksel.com/beam?r=' + encodeURIComponent(
		jsonConfig);
})();
