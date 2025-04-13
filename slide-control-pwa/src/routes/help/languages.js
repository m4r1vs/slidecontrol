const languages = {
  en: {
    page: {
      step: "Step",
    },
    buttons: {
      next: "NEXT STEP",
      previous: "PREVIOUS STEP",
      stuck: "IM STUCK",
    },
  },
  de: {
    page: {
      step: "Schritt",
    },
    buttons: {
      next: "WEITER",
      previous: "ZURÜCK",
      stuck: "HILFE",
    },
  },
};

export default languages[
  typeof window === "undefined"
    ? "en"
    : localStorage.getItem("slidecontrol-language") || "en"
];
