export default new (class Localization {
  constructor() {
    this.supportedLanguages = ["en", "de"];
    if (typeof window !== "undefined")
      localStorage.setItem("slidecontrol-language", this.language);
  }

  get language() {
    let lang = localStorage.getItem("slidecontrol-language") || "en";

    if (lang && this.supportedLanguages.includes(lang)) {
      return lang;
    }

    for (let i = 0; i < navigator.languages.length; i++) {
      if (this.supportedLanguages.includes(navigator.languages[i])) {
        lang = navigator.languages[i];
        break;
      }
    }

    return lang || "en";
  }

  set language(lang) {
    localStorage.setItem("slidecontrol-language", lang);
    if (typeof window !== "undefined")
      localStorage.setItem("slidecontrol-language", lang);
  }
})();
