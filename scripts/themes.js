const themes = {
    dark:        { name: "Dark",        file: "themes/dark.css" },
    midnight:    { name: "Midnight",    file: "themes/midnight.css" },
    light:       { name: "Light",       file: "themes/light.css" },
    solarized:   { name: "Solarized",   file: "themes/solarized.css" },
    aurora:     { name: "aurora",       file: "themes/aurora.css" },
    barbiepink:  { name: "Barbie Pink", file: "themes/barbie-pink.css" }
};

function applyThemeCss(themeFile) {
    const existing = document.getElementById('theme-css');
    if (existing) existing.parentNode.removeChild(existing);
    const link = document.createElement('link');
    link.id = 'theme-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = themeFile;
    document.head.appendChild(link);
}

function setTheme(themeName) {
    const theme = themes[themeName] || themes.dark;
    applyThemeCss(theme.file);
    localStorage.setItem('themeName', themeName);
    document.documentElement.setAttribute('data-theme', themeName);
}

setTheme(localStorage.getItem('themeName') || 'dark');

window.themes = themes;
window.setTheme = setTheme;