import { getSuggestions, addToHistory } from "./suggestions.js";
import { isLikelyUrl, normalizeUrl } from "./searchUtils.js";
import { buildSearchUrl } from "./searchEngines.js";

const DEBOUNCE_MS = 180;
const CLOCK_ICON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`;
const SEARCH_ICON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`;
export function initSearchBar(prefs) {
  const container = document.getElementById("search-container");
  const input = document.getElementById("search-input");
  const dropdown = document.getElementById("suggestions-dropdown");
  let suggestions = [];
  let activeIndex = -1;
  let debounceTimer = null;
  let abortController = null;
  container.style.setProperty("--glow-color", prefs.color);
  container.hidden = false;
  setTimeout(() => container.classList.add("glow-in"), 50);
  input.addEventListener("input", () => {
    const query = input.value;
    clearTimeout(debounceTimer);
    abortController?.abort();
    if (!query.trim()) {
      renderSuggestions([]);
      return;
    }
    debounceTimer = setTimeout(async () => {
      abortController = new AbortController();
      const results = await getSuggestions(query, abortController.signal);
      renderSuggestions(results);
    }, DEBOUNCE_MS);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(Math.min(activeIndex + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(Math.max(activeIndex - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen =
        activeIndex >= 0 ? suggestions[activeIndex].text : input.value;
      commitSearch(chosen);
    } else if (e.key === "Escape") {
      renderSuggestions([]);
    }
  });
  document.addEventListener("mousedown", (e) => {
    if (!container.contains(e.target)) {
      renderSuggestions([]);
    }
  });
  function setActiveIndex(index) {
    activeIndex = index;
    [...dropdown.children].forEach((li, i) => {
      li.classList.toggle("active", i === activeIndex);
    });
  }
  function renderSuggestions(items) {
    suggestions = items;
    activeIndex = -1;
    dropdown.innerHTML = "";
    if (items.length === 0) {
      dropdown.hidden = true;
      return;
    }
    items.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "suggestion-item";
      li.style.transitionDelay = `${i * 25}ms`;
      const icon = document.createElement("span");
      icon.className = "suggestion-icon";
      icon.innerHTML = item.type === "history" ? CLOCK_ICON : SEARCH_ICON;
      const text = document.createElement("span");
      text.className = "suggestion-text";
      text.textContent = item.text;
      li.appendChild(icon);
      li.appendChild(text);
      li.addEventListener("mousemove", (e) => {
        const rect = li.getBoundingClientRect();
        li.style.setProperty("--x", `${e.clientX - rect.left}px`);
        li.style.setProperty("--y", `${e.clientY - rect.top}px`);
      });
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        commitSearch(item.text);
      });
      dropdown.appendChild(li);
    });
    dropdown.hidden = false;
  }
  function commitSearch(rawValue) {
    const value = rawValue.trim();
    if (!value) return;
    addToHistory(value);
    renderSuggestions([]);
    if (isLikelyUrl(value)) {
      window.location.href = normalizeUrl(value);
    } else {
      window.location.href = buildSearchUrl(
        prefs.searchEngine,
        value,
        prefs.customTemplate
      );
    }
  }
  input.focus();
}
