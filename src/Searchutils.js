//FYI it took me 3 FUCKING HOURS of my life to figure out how to do this url detection thing

export function istsaurl(input) {
    const trimmed = input.trim();
    if (!trimmed || trimmed.includes(" ")) return false;
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return true;
    if (/^localhost(:\d+)?(\/.*)?$/i.test(trimmed)) return true;
    if (/^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/.test(trimmed)) return true

    const domainPattern =
      /^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
    return domainPattern.test(trimmed);
}

export function normaliseUrl(input) {
    const trimmed = input.trim();
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
    return 'https://${trimmed}';
}
