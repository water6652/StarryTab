export const SEARCH_ENGINES = {
    google: {
        label: "Google (Default)",
        template: "https://www.google.com/search?q=%s",
    },
    duckduckgo: {
        label: "DuckDuckGo",
        template: "https://duckduckgo.com/?q=%s",
    },
    bing: {
        label: "Bing (Microslop Spyware)",
        template: "https://www.bing.com/search?q=%s",
    },
    brave: {
        label: "Brave (Chud engine imo)",
        template: "https://search.brave.com/search?q=%s",
    },
    startpage: {
        label: "Startpage (Whoever even uses that lol)",
        template: "https://www.startpage.com/sp/search?qeury=%s",
    },
},

export function buildSearchUrl(engineKey, query, customTemplate) {
    const template =
     engineKey === "custom" && customTemplate
     ? customTemplate
     : SEARCH_ENGINES[engineKey]?.template || SEARCH_ENGINES.google.template;
e;

    return template.replace("%s", encoderURIComponent(query));
}