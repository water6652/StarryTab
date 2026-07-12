import { SEARCH_ENGINES } from "./searchEngines";
import { setStored } from "./storage";

const PRESET_COLORS = [
    "#7826c5", // violet (or purple idk im colorblind)
    "#5cbaf4", // sky blue
    "#f987cf", // slightly light pink
    "#0aa53b", // forest green
    "#ce1a1a", // bloody red mate
]
const PREFS_KEY = "starrytab_prefs"
export function initOnboarding(onComplete) {
    const overlay = document.getElementById("onboarding-overlay");
    const engineGrid = document.getElementById("engine-grid");
    const colorGrid = document.getElementById("color-grid");
    const customInput = document.getElementById("custom-template-input");
    const nextBtn = document.getElementById("onboarding-next");
    const doneBtn = document.getElementById("onboarding-done");
    const stepEngine = document.getElementById("onboarding-step-engine");
    const stepColor = document.getElementById("onboarding-step-color");
    let selectedEngine = "google";
    let selectedColor = PRESET_COLORS[0];

    Object.entries(SEARCH_ENGINES).forEach(([key, engine]) => {
       const btn = document.createElement("button");
       btn.className = "engine-option";
       btn.textContent = engine.label;
       btn.dataset.key = key;
       if (key === selectedEngine) btn.classList.add("selected");
       btn.addEventListener("click", () => selectEngine(key, btn));
       engineGrid.appendChild(btn);
    });
    const customBtn = document.createElement("button");
    customBtn.className = "engine-option";
    customBtn.textContent = "Custom";
    customBtn.dataset.key = "custom";
    customBtn.addEventListener("click", () => selectEngine("custom", customBtn));
    engineGrid.appendChild(customBtn);
    function selectEngine(key, btnEl) {
        selectedEngine = key;
        [...engineGrid.children].forEach((b) => b.classList.remove("selected"));
        btnEl.classList.add("selected");
        customInput.hidden = key !== "custom";
        updateNextEnabled();
    }
    function updateNextEnabled() {
    const isCustomValid =
      selectedEngine !== "custom" || customInput.value.includes("%s");
    nextBtn.disabled = !isCustomValid;
    }
    customInput.addEventListener("input", updateNextEnabled);
    nextBtn.addEventListener("click", () => {
        stepEngine.hidden = true;
        stepColor.hidden = false;
    });
    PRESET_COLORS.forEach((color) => {
    const swatch = document.createElement("button");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = color;
    swatch.setAttribute("aria-label", color);
    if (color === selectedColor) swatch.classList.add("selected");
    swatch.addEventListener("click", () => selectColor(color, swatch));
    colorGrid.appendChild(swatch);
  });
  const customSwatchLabel = document.createElement("label");
  customSwatchLabel.className = "color-swatch custom-swatch";
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = selectedColor;
  colorInput.addEventListener("input", (e) => {
    selectColor(e.target.value, customSwatchLabel);
  });
  customSwatchLabel.appendChild(colorInput);
  colorGrid.appendChild(customSwatchLabel);
  function selectColor(color, swatchEl) {
    selectedColor = color;
    [...colorGrid.children].forEach((s) => s.classList.remove("selected"));
    swatchEl.classList.add("selected");
  }
  doneBtn.addEventListener("click", () => {
    const prefs = {
      searchEngine: selectedEngine,
      customTemplate: selectedEngine === "custom" ? customInput.value : "",
      color: selectedColor,
    };
    setStored(PREFS_KEY, prefs);
    overlay.hidden = true;
    onComplete(prefs);
  });
  updateNextEnabled();
  overlay.hidden = false;
}
