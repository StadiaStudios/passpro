(function () {
    if (window.__passpro_backnavbar_loaded) return;
    window.__passpro_backnavbar_loaded = true;

    function injectBackNavbarShadow() {
        let host = document.getElementById('nav-placeholder');
        if (!host) {
            host = document.createElement('div');
            host.id = 'nav-placeholder';
            document.body.appendChild(host);
        }
        host.innerHTML = '';
        const shadow = host.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
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
}
.ppnav__bottom-navbar {
    pointer-events: auto;
    display: flex;
    align-items: center;
    background: rgba(41,41,41,0.62);
    border-radius: 32px;
    box-shadow: 0px 4px 18px 3px rgba(0,0,0,0.25);
    padding: 12px 32px;
    margin-bottom: 24px;
    min-width: 80px;
    max-width: 96vw;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 16px;
    transition: background 0.2s;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1.5px solid rgba(60, 150, 252, 0.86);
    justify-content: center;
    gap: 0;
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
    font-size: 1.7em;
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
        padding: 8px 6vw;
    }
    .ppnav__icon-link__icon {
        font-size: 1.4em;
        width: 26px;
        height: 26px;
    }
}
`;

        // Single Back icon/button only
        const iconBack = `
<svg class="ppnav__icon-link__icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M15.41 7.41a1 1 0 0 0-1.41-1.41l-5 5a1 1 0 0 0 0 1.41l5 5a1 1 0 1 0 1.41-1.41L11.83 12l3.58-3.59z"/></g></svg>
`;

        const html = `
<div class="ppnav__bottom-navbar-wrapper">
    <nav class="ppnav__bottom-navbar" aria-label="PassPro back navigation">
        <a href="../index.html" class="ppnav__icon-link" aria-label="Back to main" tabindex="0">
            ${iconBack}
            <span class="ppnav__icon-link__label">Back</span>
        </a>
    </nav>
</div>
`;

        shadow.appendChild(style);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        wrapper.childNodes.forEach(n => shadow.appendChild(n));

        // Highlight the back button if this is not the main page
        const backLink = shadow.querySelector('.ppnav__icon-link');
        const current = window.location.pathname.replace(/^\//, '');
        if (backLink && !current.endsWith('index.html')) {
            backLink.setAttribute('aria-current', 'page');
            backLink.classList.add("active");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectBackNavbarShadow, { once: true });
    } else {
        injectBackNavbarShadow();
    }
})();