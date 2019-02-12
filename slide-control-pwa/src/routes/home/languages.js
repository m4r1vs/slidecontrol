const languages = {
	en: {
		greetings: {
			morning: 'Good Morning, ',
			day: 'Hey there, ',
			afternoon: 'Good Afternoon, ',
			evening: 'Good Evening, ',
			night: 'Good Night, '
		},
		page: {
			enterCode: [
				`Enter your slide's code here,`,
				`or let us show you `,
				`how to get your code`
			],
			submitCodeButton: 'LET\'S GO',
			codeLabel: 'Your Slides Code',
			helpButton: 'I NEED HELP'
		},
		errors: {
			socketClosed: {
				msg: 'Calling server returned a wucy fucky :o',
				action: 'SETTINGS'
			},
			wrongCode: {
				msg: code => `Hmm, seems like the code ${code} is not used by any presentation :/`,
				action: 'HELP'
			},
			socketError: {
				msg: 'We fucked up big here, server seems dead ass dead',
				action: 'SETTINGS'
			}
		}
	},
	de: {
		greetings: {
			morning: 'Guten Morgen, ',
			day: 'Moin Moin, ',
			afternoon: 'Moin Moin, ',
			evening: '\'n Abend, ',
			night: 'Gute Nacht, '
		},
		page: {
			enterCode: [
				`Gib deinen Code hier ein,`,
				`oder erlaube es uns dir zu zeigen, `,
				`wie du an deinen Code kommst`
			],
			submitCodeButton: 'LOS GEHTS!',
			codeLabel: 'Code deiner Präsentation',
			helpButton: 'ICH BRAUCHE HILFE'
		},
		errors: {
			socketClosed: {
				msg: 'Herr Server ist gerade nicht erreichbar. Bitte versuchen Sie es später erneut',
				action: 'EINSTELLUNGEN'
			},
			wrongCode: {
				msg: code => `Sieht ganz danach aus, dass der code #${code} falsch ist :o`,
				action: 'HILFE'
			},
			socketError: {
				msg: 'Server hat sich verasbchiedet, tut uns ja leid :/',
				action: 'EINSTELLUNGEN'
			}
		}
	}
};

export default languages[(typeof window === 'undefined') ? 'en' : window.slidecontrolLanguage];