import { getStored, setStored } from "./storage.js";

const HISTORY_KEY = "starrytab_search_history";
const MAX_HISTORY = 100;
const MAX_SUGGESTIONS = 8;
function readHistory() {
  return getStored(HISTORY_KEY, []);
}
function writeHistory(list) {
  setStored(HISTORY_KEY, list);
}
export function addToHistory(query) {
  const trimmed = query.trim();
  if (!trimmed) return;

  const existing = readHistory();
  const deduped = existing.filter(
    (item) => item.toLowerCase() !== trimmed.toLowerCase()
  );
  deduped.unshift(trimmed);
  writeHistory(deduped.slice(0, MAX_HISTORY));
}
function getHistoryMatches(query) {
  const lower = query.toLowerCase();
  return readHistory()
    .filter((item) => item.toLowerCase().includes(lower))
    .map((text) => ({ type: "history", text }));
}
async function getLiveMatches(query, signal) {
  try {
    const res = await fetch(
      `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`,
      { signal }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item) => ({ type: "suggestion", text: item.phrase }));
  } catch {
    return [];
  }
}
export async function getSuggestions(query, signal) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const historyMatches = getHistoryMatches(trimmed);
  const remainingSlots = MAX_SUGGESTIONS - historyMatches.length;

  let liveMatches = [];
  if (remainingSlots > 0) {
    const live = await getLiveMatches(trimmed, signal);
    const historyTextsLower = new Set(
      historyMatches.map((h) => h.text.toLowerCase())
    );
    liveMatches = live
      .filter((item) => !historyTextsLower.has(item.text.toLowerCase()))
      .slice(0, remainingSlots);
  }
  return [...historyMatches.slice(0, MAX_SUGGESTIONS), ...liveMatches].slice(
    0,
    MAX_SUGGESTIONS
  );
}
