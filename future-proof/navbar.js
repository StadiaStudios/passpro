// Pure, sandboxed, fully isolated PassPro bottom navbar. iOS-style round navbar on the bottom.
(function () {
    if (window.__passpro_navbar_loaded) return;
    window.__passpro_navbar_loaded = true;

    function injectBottomNavbarShadow() {
        let host = document.getElementById('nav-placeholder');
        if (!host) {
            host = document.createElement('div');
            host.id = 'nav-placeholder';
            document.body.appendChild(host);
        }
        host.innerHTML = '';
        const shadow = host.attachShadow({ mode: 'open' });

        // CSS for circle/rounded iOS-like sticky bottom navbar with blurred dark background
        const CSS = `
:host {
    all: initial;
}
.ppnav__bottom-navbar-wrapper {
    all: unset;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    z-index: 2147483646;
    display: flex;
    justify-content: center;
    pointer-events: none;
    background: none;
}
.ppnav__bottom-navbar {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 34px;
    background: rgba(41, 41, 41, 0.62);
    border-radius: 32px;
    box-shadow: 0px 4px 18px 3px rgba(0,0,0,0.25);
    padding: 12px 32px 12px 32px;
    margin-bottom: 24px;
    min-width: 240px;
    max-width: 96vw;
    font-family: 'Inter', system-ui, sans-serif !important;
    font-size: 16px;
    transition: background 0.2s;
    /* Blurred background effect */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1.5px solid rgba(80,80,110,0.16);
}
.ppnav__icon-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    appearance: none;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
    outline: none;
    gap: 1.5px;
    min-width: 58px;
}
.ppnav__icon-link[aria-current="page"], 
.ppnav__icon-link.active {
    color: #bb86fc;
}
.ppnav__icon-link:focus-visible {
    outline: 2px solid #bb86fc;
    outline-offset: 2px;
}
.ppnav__icon-link__icon {
    display: block;
    font-size: 1.70em;
    height: 30px;
    width: 30px;
    color: #aaa;
    transition: color 0.18s;
}
.ppnav__icon-link__label {
    margin-top: 1px;
    font-size: 0.95em;
    color: #cfcfcf;
    font-weight: 600;
}
.ppnav__icon-link:hover .ppnav__icon-link__icon,
.ppnav__icon-link:focus .ppnav__icon-link__icon {
    color: #bb86fc;
}
.ppnav__icon-link:hover .ppnav__icon-link__label,
.ppnav__icon-link:focus .ppnav__icon-link__label {
    color: #bb86fc;
}
@media (max-width: 500px) {
    .ppnav__bottom-navbar {
        gap: 9vw;
        padding: 8px 6vw;
    }
    .ppnav__icon-link__icon {
        font-size: 1.40em;
        width: 26px;
        height: 26px;
    }
}
`;
        const style = document.createElement('style');
        style.textContent = CSS;

        // SVG icons for an iOS-style look (Material icons, inline, fixed for correct alignment/appearance)
        const icons = {
            "Add": `
<svg class="ppnav__icon-link__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="1em" height="1em">
  <g>
    <rect width="24" height="24" fill="none"/>
    <path fill="currentColor" d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1z"/>
  </g>
</svg>`,
            "Passwords": `
<svg class="ppnav__icon-link__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="1em" height="1em">
  <g>
    <rect width="24" height="24" fill="none"/>
    <path fill="currentColor" d="M17 8V7a5 5 0 0 0-10 0v1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2zm-8-1a3 3 0 0 1 6 0v1h-6V7zm10 3v9H5v-9h14zm-7 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/>
  </g>
</svg>`,
            "website": `
<svg class="ppnav__icon-link__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="1em" height="1em">
  <g>
    <rect width="24" height="24" fill="none"/>
    <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9H19a8 8 0 0 0-6.84-7.87A8.03 8.03 0 0 1 19.93 11zm-2.02 0h-2.06a12.53 12.53 0 0 0-1.7-6.6A8.03 8.03 0 0 1 17.91 11zm-6.18 0A10.5 10.5 0 0 1 12 4.07 10.5 10.5 0 0 1 13.27 11h-2.54zm4.44 0A12.07 12.07 0 0 0 12 4.71 12.07 12.07 0 0 0 9.74 11h4.52zM12 19.93A8 8 0 0 1 5.06 13h2.02c.15 2.1.81 4 1.77 5.37A7.99 7.99 0 0 0 12 19.93zm1.7-2.33A10.51 10.51 0 0 0 12 19.93a8.03 8.03 0 0 0 6.85-7.87H17.9c-.15 2.1-.81 4-1.77 5.37zm-7.63-4.6A7.98 7.98 0 0 1 4.07 12a8 8 0 0 1 1.87-5.33A11.92 11.92 0 0 0 6.63 12zm2.05 0H6.62a8.03 8.03 0 0 1 6.85-7.87c-.62 1.36-1.23 3.36-1.36 5.49zm6.33 0h-2.06a10.52 10.52 0 0 0-1.7 6.6c.62-1.36 1.23-3.36 1.36-5.49zm2.87 0a11.9 11.9 0 0 0-1.7 5.33 7.97 7.97 0 0 1-1.88-5.33h2.02zm-7.91 0a11.9 11.9 0 0 0 1.7-5.33A8.01 8.01 0 0 1 12 3.93c.62 1.36 1.23 3.36 1.36 5.49z"/>
  </g>
</svg>`,
            "Settings": `
<svg class="ppnav__icon-link__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="1em" height="1em">
  <g>
    <rect width="24" height="24" fill="none"/>
    <path fill="currentColor" d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a8.12 8.12 0 0 0-1.7-.98l-.38-2.65A.5.5 0 0 0 13 2h-2a.5.5 0 0 0-.50.42l-.39 2.65c-.61.24-1.19.56-1.7.98l-2.49-1a.5.5 0 0 0-.62.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.66-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.51.43 1.09.74 1.7.98l.39 2.65A.5.5 0 0 0 11 22h2a.5.5 0 0 0 .50-.42l.38-2.65c.61-.24 1.19-.55 1.7-.98l2.49 1a.5.5 0 0 0 .62-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
  </g>
</svg>`
        };


        // HTML for round bottom navbar
        const html = `
<div class="ppnav__bottom-navbar-wrapper">
    <nav class="ppnav__bottom-navbar" aria-label="PassPro bottom navigation">
        <a href="index.html" class="ppnav__icon-link" aria-label="Add New" tabindex="0">
            ${icons["Add New"]}
            <span class="ppnav__icon-link__label">Add</span>
        </a>
        <a href="passwords.html" class="ppnav__icon-link" aria-label="Passwords" tabindex="0">
            ${icons["Passwords"]}
            <span class="ppnav__icon-link__label">Passwords</span>
        </a>
        <a href="settings.html" class="ppnav__icon-link" aria-label="Settings" tabindex="0">
            ${icons["Settings"]}
            <span class="ppnav__icon-link__label">Settings</span>
        </a>
        <a href="https://stadiastudios.github.io/stadia/" class="ppnav__icon-link" aria-label="website" tabindex="0">
            ${icons["website"]}
            <span class="ppnav__icon-link__label">Stadia</span>
        </a>
    </nav>
</div>
        `;
        shadow.appendChild(style);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        Array.from(wrapper.childNodes).forEach(n => shadow.appendChild(n));

        // JS logic: highlight active nav on page load
        const navLinks = Array.from(shadow.querySelectorAll('.ppnav__icon-link'));
        const current = window.location.pathname.replace(/^\//, '');
        for (const link of navLinks) {
            const href = link.getAttribute('href') || '';
            if (
                (!current && href.endsWith('index.html')) ||
                (current && href && current.toLowerCase().includes(href.replace('.html', '').toLowerCase()))
            ) {
                link.setAttribute('aria-current', 'page');
                link.classList.add("active");
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectBottomNavbarShadow, { once: true });
    } else {
        injectBottomNavbarShadow();
    }
})();