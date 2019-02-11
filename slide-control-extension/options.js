// Saves options to chrome.storage
function save_ip() {

	var ip = (!!document.getElementById('server-local').value)
		? document.getElementById('server-local').value
		: document.getElementById('server-options').value

	chrome.storage.sync.set({
		websocketIP: ip
	}, function () {
		var status = document.getElementById('status')
		document.getElementById('current-server').textContent = ip
		status.textContent = 'IP set to ' + ip
		setTimeout(function () {
			status.textContent = ''
		}, 3250)
	})
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		websocketIP: 'wss://www.maniyt.de:61263'
	}, function (settings) {

		document.getElementById('current-server').textContent = settings.websocketIP

		if (settings.websocketIP === 'wss://www.maniyt.de:61263' || settings.websocketIP === 'wss://mn.uber.space/slidecontrol-socket') {
			document.getElementById('server-options').value = settings.websocketIP
		}
		else {
			document.getElementById('server-local').value = settings.websocketIP
		}
	})
}

document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('save').addEventListener('click', save_ip)