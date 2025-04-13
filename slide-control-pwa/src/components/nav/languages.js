const languages = {
  en: {
    pages: {
      home: "Home",
      settings: "Settings",
      about: "About",
      donate: "Donate",
      extension: "Get Extension",
      copyright: ["SLIDECONTROL © ", "by Niels Kapeller & Marius Niveri"],
    },
  },
  de: {
    pages: {
      home: "Startseite",
      settings: "Einstellungen",
      about: "Information",
      donate: "Trinkgeld",
      extension: "Zur Erweiterung",
      copyright: ["SLIDECONTROL © ", "von Niels Kapeller & Marius Niveri"],
    },
  },
};

export default languages[
  typeof window === "undefined"
    ? "en"
    : localStorage.getItem("slidecontrol-langauge") || "en"
];
