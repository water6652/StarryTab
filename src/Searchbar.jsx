import { useState, useEffect, useRef, useCallback } from "react";
import { getSuggestions } from "./Suggestions";
import { istsaurl, normaliseUrl } from "./searchUtils";
import { buildSearchUrl } from "./Searchengines";
import "./searchbar.css";

const DEBOUNCE_MS = 180;
export default function SearchBar({ prefs }) {
    const [query, setQuery] =useState("");
    const [Suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isFoucused, setIsFocused] = useState(false);
    const [glowIn, setGlowIn] = useState(false);
    const debounceRef = useRef(null);
    const abortRef = useRef(null);
    const containerRef = useRef(null);
    useEffect(() => {
        const t = setTimeout(() => setGlowIn(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        clearTimeout(debounceRef.current)
        abortRef.current?.abort();
        if(!query.trim()) {
            setSuggestions([]);
            setActiveIndex(-1);
            return;
    }
    debounceRef.current = setTimeout(async () => {
        const controller = new AbortController();
        abortRef.current = controller;
        const results = await getSuggestions(query, controller.signal);
        setSuggestions(results);
        setActiveIndex(-1);
    },  DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
      }, [query]);
     useEffect(() => {
        function handleClickOutside(e) {
          if (containerRef.current && !containerRef.current.contains(e.target)) {
            setIsFocused(false);
          }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const commitSearch = useCallback(
    (rawValue) => {
      const value = rawValue.trim();
      if (!value) return;
 
      addToHistory(value);
 
      if (isLikelyUrl(value)) {
        window.location.href = normalizeUrl(value);
      } else {
        window.location.href = buildSearchUrl(
          prefs.searchEngine,
          value,
          prefs.customTemplate
        );
      }
    },
    [prefs]
  );
  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen =
        activeIndex >= 0 ? suggestions[activeIndex].text : query;
      commitSearch(chosen);
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  }
  function handleItemMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }
  const showDropdown = isFocused && suggestions.length > 0;
  return (
    <div
      className={`searchbar-container ${glowIn ? "glow-in" : ""}`}
      style={{ "--glow-color": prefs.color }}
      ref={containerRef}
    >
      <input
        className="searchbar-input"
        type="text"
        value={query}
        placeholder="Search or enter a URL"
        autoFocus
        // yay 100 lines i dont have a life 🎉🎉
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setIsFocused(false), 120)}
      />
      {showDropdown && (
        <ul className="suggestions-dropdown">
          {suggestions.map((item, i) => (
            <li
              key={`${item.type}-${item.text}`}
              className={`suggestion-item ${
                i === activeIndex ? "active" : ""
              }`}
              style={{ transitionDelay: `${i * 25}ms` }}
              onMouseMove={handleItemMouseMove}
              onMouseDown={(e) => {
                e.preventDefault();
                commitSearch(item.text);
              }}
            >
              <span className="suggestion-icon">
                {item.type === "history" ? "🕐" : "🔍"}
              </span>
              <span className="suggestion-text">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
//i woke up in a new bugati🔥🔥🔥🔥🔥🔥🔥
