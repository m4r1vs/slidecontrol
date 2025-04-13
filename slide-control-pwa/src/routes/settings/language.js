const languages = {
  en: {
    page: {
      server: {
        title: "WebSocket Server",
        description: [
          "If you are having problems connecting to our server you can try connecting to a different one here.",
          "Just remember to also change to the chosen server in slidecontrol's extension settings as well (click on the icon in Chrome's menu and then \"Options\").",
          (ip) => `Current server: "${ip}"`,
        ],
        select: {
          title: "WebSocket server to connect to:",
        },
        input: {
          title: 'Or if you run your server locally (dont forget "ws(s)://"):',
        },
        buttonSave: "save",
      },
      language: {
        title: "Language",
        description:
          "Slidecontrol is available in different languages, choose yours here. If you want to add a language or just help to translate slidecontrol, raise a GitHub issue please.",
        languages: {
          en: "English",
          de: "German",
        },
      },
      speechToText: {
        title: "Closed Captions",
        description: "Toggle the experimental feature to show closed captions.",
        buttonEnable: "Turn On",
        buttonDisable: "Turn Off",
      },
    },
    notifications: {
      serverSaved: (ip) => `Changed server to "${ip}"`,
    },
  },
  de: {
    page: {
      server: {
        title: "WebSocket Server",
        description: [
          "Falls du Probleme haben solltest dich mit unserem Server zu verbinden, kannst du diesen hier auf einen anderen umstellen.",
          "Du darfst bloß nicht vergessen diesen dann auch in der slidecontrol Erweiterung zu ändern (klicke auf das slidecontrol Logo in Chrome oben rechts und dann auf optionen)",
          (ip) => `Aktuell ausgewählter Server: "${ip}"`,
        ],
        select: {
          title: "Wähle einen Server aus:",
        },
        input: {
          title:
            'Oder verbinde dich mit einem lokal von dir betriebenen slidecontrol server ("ws(s)://" nicht vergessen!):',
        },
        buttonSave: "speichern",
      },
      language: {
        title: "Sprache",
        description:
          "Slidecontrol ist mehrsprachig. Wähle hier deine Sprache aus. Solltest du uns helfen wollen slidecontrol zu übersetzen, biete dies gerne auf GitHub an!",
        languages: {
          en: "Englisch",
          de: "Deutsch",
        },
      },
      speechToText: {
        title: "Untertitel",
        description:
          "Schalte die experimentelle Funktion ein, bzw. aus Untertitel zu generieren.",
        buttonEnable: "Schalte Ein",
        buttonDisable: "Schalte Aus",
      },
    },
    notifications: {
      serverSaved: (ip) => `Server wurde geändert zu "${ip}"`,
    },
  },
};

export default languages[
  typeof window === "undefined"
    ? "en"
    : localStorage.getItem("slidecontrol-language") || "en"
];
