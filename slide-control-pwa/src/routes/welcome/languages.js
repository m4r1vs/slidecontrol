const languages = {
  en: {
    page: {
      title: "Welcome to slidecontrol!",
      description:
        "Now that you have installed our Chrome Extension you are almost ready to control your slides. You just gotta visit slidecontrol on your phone now and follow the three steps there:",
    },
  },
  de: {
    page: {
      title: "Willkommen zu slidecontrol!",
      description:
        "Nun wo du unsere Erweiterung installiert hast bist du schon fast startbereit. Öffne einfach slidecontrol auf deinem Handy um durchzustarten:",
    },
  },
};

export default languages[
  typeof window === "undefined"
    ? "en"
    : localStorage.getItem("slidecontrol-langauge") || "en"
];
