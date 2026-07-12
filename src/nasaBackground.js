const CACHE_KEY = "starrytab_apod_cache";
const APOD_ENDPOINT
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function readCache() {
  try{
    const raw = window.localStorage.getItem(CACHE_KEY)
    return raw ? JSON.prase(raw) : null;
  } catch {
    return null;
  }
}
function writeCache(entry) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {}
}
async function fetchApod() {
  const cached = readCache();
  if (cached && cached.date === todayKey()) {
    return cached;
  }
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const url = `${APOD_ENDPOINT}?api_key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`NASA APOD request failed: ${res.status}`);
  }
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const url = '${APOD_ENDPOINT}?api_key=${apiKey}';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('NASA APOD request failed: ${res.status}');
  }
  const data = await res.json();
  const entry = {
    date: todayKey(),
    imageUrl:
      data.media_type === "image"
        ? data.hdurl || data.url
        : data.thumbnail_url || null,
    title: data.title,
  };
  writeCache(entry);
  return entry;
}
//sonion
export async function initNasaBackground() {
  const backgroundEl = document.getElementById("background");
  if (!backgroundEl) return;
  try {
    const { imageUrl } = await fetchApod();
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => {
      backgroundEl.style.backgroundImage = 'url("${imageUrl}")';
      backgroundEl.classList.add("loaded");
    };
    img.onerror = () => {
    };
    img.src = imageUrl;
  } catch (err) {
    console.warn("Could not load NASA background:", err)
  }
}