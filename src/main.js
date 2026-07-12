import "./style.css";
import "./onboarding.css";
import "./searchbar.css";
import { getStored } from "./storage.js";
import { initOnboarding } from "./onboarding.js";
import { initSearchBar } from "./searchbar.js";
import { initNasaBackground } from "./nasaBackground.js";

const PREFS_KEY = "starrytab_prefs";
initNasaBackground();
const prefs = getStored(PREFS_KEY, null);
if (prefs) {
  initSearchBar(prefs);
} else {
  initOnboarding((newPrefs) => initSearchBar(newPrefs));
}
