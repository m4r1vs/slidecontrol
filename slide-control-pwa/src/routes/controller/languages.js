const languages = {
	en: {
		page: {
			toggleDarkModeButton: 'Toggle dark-mode',
			startTimerButton: 'start timer',
			showNotesButton: 'show notes',
			showLaserpointerButton: 'laserpointer',
			toggleClosedCaptions: 'Toggle Closed Captioning'
		},
		notifications: {
			timer: {
				started: 'Started new timer for you',
				resumed: time => `Resumed timer for you at ${time}`,
				paused: {
					msg: time => `Paused timer for you at ${time}`,
					action: 'RESET IT'
				}
			},
			closedCaptions: {
				started: 'Started speech to text engine.',
				stoped: 'Stoped closed captioning'
			},
			synced: (title, code) => `Synced to "${title}" (#${code})`,
			disconnected: 'Disconnected'
		},
		errors: {
			socketClosed: {
				msg: 'Calling server returned a wucy fucky :o',
				action: 'SETTINGS'
			},
			closedCaptions: 'Error during closed captioning.',
			wrongCode: {
				msg: code => `You just did a big oopsie doopsie, cz the code you entered (${code}) is invalid.`,
				action: 'FUCK, GO BACK!'
			},
			socketError: {
				msg: 'We fucked up big here, server seems dead ass dead',
				action: 'SETTINGS'
			}
		}
	},
	de: {
		page: {
			toggleDarkModeButton: 'Wechsel zwischen hellem und dunklem Modus',
			startTimerButton: 'starte Timer',
			showNotesButton: 'Notizen',
			showLaserpointerButton: 'Laserpointer',
			toggleClosedCaptions: 'Untertitel An/Aus'
		},
		notifications: {
			timer: {
				started: 'Timer wurde gestartet',
				resumed: time => `Timer fortgesetzt bei ${time}`,
				paused: {
					msg: time => `Timer wurde pausiert bei ${time}`,
					action: 'ZURÜCKSETZEN'
				}
			},
			closedCaptions: {
				started: 'Untertitel wurden gestarted',
				stoped: 'Untertitel gestoppt.'
			},
			synced: (title, code) => `Verbunden mit "${title}" (#${code})`,
			disconnected: 'Verbindung getrennt'
		},
		errors: {
			socketClosed: {
				msg: 'Herr Server ist gerade nicht erreichbar. Bitte versuchen Sie es später erneut',
				action: 'EINSTELLUNGEN'
			},
			closedCaptions: 'Fehler beim erstellen der Untertitel',
			wrongCode: {
				msg: code => `Sieht ganz danach aus, dass der code #${code} falsch ist :o`,
				action: 'RÜCKZUG'
			},
			socketError: {
				msg: 'Server hat sich verasbchiedet, tut uns ja leid :/',
				action: 'EINSTELLUNGEN'
			}
		}
	}
};

export default languages[(typeof window === 'undefined') ? 'en' : window.slidecontrolLanguage];