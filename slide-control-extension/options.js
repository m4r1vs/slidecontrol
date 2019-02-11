// script is ran by options.html

// Saves options to chrome.storage
const save_ip = () => {

    // get input field values
	var ip = (!!document.getElementById('server-local').value)
        ? document.getElementById('server-local').value
        : document.getElementById('server-options').value

    // put IP in chrome storage
	chrome.storage.sync.set({
		websocketIP: ip
	}, () => {

        // then tell user that it got updated
        document.getElementById('status').textContent = 'IP set to ' + ip
        document.getElementById('current-server').textContent = ip
        
		setTimeout(() => {
			status.textContent = ''
		}, 3250)
	})
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restore_options = () => {
	chrome.storage.sync.get({
		websocketIP: 'wss://www.maniyt.de:61263'
	}, settings => {
        
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