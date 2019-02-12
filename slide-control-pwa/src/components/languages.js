const languages = {
	en: {
		page: {
		},
		titles: {
			home: 'Slidecontrol',
			help: 'Help',
			scanner: 'Scanner',
			controller: 'Loading...',
			settings: 'Settings',
			donate: 'Donate <3',
			about: 'About',
			aboutUs: 'About us',
			aboutCode: 'Our Code',
			aboutPrivacy: 'Privacy',
			aboutCredits: 'Credits',
			aboutLicenses: 'Open-Source Licenses',
			welcome: 'Welcome :)',
			blank: 'Error 404'
		},
		notifications: {
			internet: {
				connected: 'Connected to the internet again',
				disconnected: 'Lost connection to the internet',
				reload: 'RELOAD'
			}
		}
	},
	de: {
		page: {
		},
		titles: {
			home: 'Slidecontrol',
			help: 'Hilfe',
			scanner: 'Scanner',
			controller: 'Lade...',
			settings: 'Einstellungen',
			donate: 'Trinkgeld <3',
			about: 'Information',
			aboutUs: 'Über uns',
			aboutCode: 'Unser Code',
			aboutPrivacy: 'Datenschutz',
			aboutCredits: 'Anerkennungen',
			aboutLicenses: 'Open-Source Lizenzen',
			welcome: 'Willkommen :)',
			blank: 'Fehler 404'
		},
		notifications: {
			internet: {
				connected: 'Wieder verbunden mit Internet',
				disconnected: 'Internetverbindung verloren',
				reload: 'NEULADEN'
			}
		}
	}
};

export default languages[(typeof window === 'undefined') ? 'en' : window.slidecontrolLanguage];