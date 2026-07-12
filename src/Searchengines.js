export const SEARCH_ENGINES = {
  google: {
    label: "Google (Default)",
    template: "https://www.google.com/search?q=%s",
  },
  duckduckgo: {
    label: "DuckDuckGo (Larp)",
    template: "https://duckduckgo.com/?q=%s",
  },
  bing: {
    label: "Bing (Microslop Spyware)",
    template: "https://www.bing.com/search?q=%s",
  },
  brave: {
    label: "Brave (Sucks ngl)",
    template: "https://search.brave.com/search?q=%s",
  },
  startpage: {
    label: "Startpage (Who even uses ts)",
    template: "https://www.startpage.com/sp/search?query=%s",
  },
};
export function buildSearchUrl(engineKey, query, customTemplate) {
  const template =
    engineKey === "custom" && customTemplate
      ? customTemplate
      : SEARCH_ENGINES[engineKey]?.template || SEARCH_ENGINES.google.template;

  return template.replace("%s", encodeURIComponent(query));
}
