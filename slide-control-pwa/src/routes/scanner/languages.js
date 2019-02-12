const languages = {
	en: {
		notifications: {
			experiment: 'This On-Device-Scanner is an experimental feature and will not work on all devices'
		},
		errors: {
			notReadable: code => `Scanned code not readable: "${code}"`,
			webWorkersNotSupported: {
				msg: 'Seems like your browser does not support WebWorkers, hence cannot read QR codes',
				action: 'BACK'
			},
			noCamera: {
				msg: 'Seems like your device has no camera to be accessed',
				action: 'BACK'
			}
		}
	},
	de: {
		notifications: {
			experiment: 'Der Scanner ist noch experimentell und wird nicht auf allen Geräten funktionieren.'
		},
		errors: {
			notReadable: code => `Der gescannte QR-Code wurde nicht als Präsentation erkannt: "${code}"`,
			webWorkersNotSupported: {
				msg: 'Dein Browser scheint keine WebWorker zu unterstützen, kann also keine QR-Codes lesen',
				action: 'ZURÜCK'
			},
			noCamera: {
				msg: 'Wir konnten keine unterstützte Kamera erkennen',
				action: 'ZURÜCK'
			}
		}
	}
};

export default languages[(typeof window === 'undefined') ? 'en' : window.slidecontrolLanguage];