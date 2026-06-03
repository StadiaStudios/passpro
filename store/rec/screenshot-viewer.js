// Store Screenshot Viewer Script

(function () {
    // Helper to create DOM element with attrs & children
    function createEl(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) =>
            k.startsWith('on')
                ? el.addEventListener(k.slice(2).toLowerCase(), v)
                : el.setAttribute(k, v)
        );
        (children || []).forEach(child => el.appendChild(child));
        return el;
    }

    // Styles for popup, backdrop, and zoom
    const style = document.createElement('style');
    style.textContent = `
.ss-viewer-blur-bg {
    position: fixed; z-index: 10001; inset: 0;
    background: rgba(30,41,59,0.34);
    backdrop-filter: blur(12px) brightness(0.78);
    display: flex; align-items: center; justify-content: center;
    animation: ss-viewer-fadein 0.2s;
}
@keyframes ss-viewer-fadein {from{opacity:0}to{opacity:1}}
.ss-viewer-container {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10002;
    max-width: 92vw; max-height: 94vh;
    outline: none;
    background: none;
    box-shadow: 0 10px 40px rgba(30,30,50,0.19);
    border-radius: 1.1em;
}
.ss-viewer-img {
    max-width: 92vw; max-height: 78vh;
    min-width: 200px;
    object-fit: contain;
    border-radius: 1em;
    transition: transform 0.17s;
    background: #fff;
    box-shadow: 0 8px 38px 0 rgba(38,40,88,0.13);
    display: block;
    margin: 0 auto;
    cursor: zoom-in;
}
.ss-viewer-img.ss-zoomed {
    cursor: zoom-out;
    max-width: 100vw; max-height: 95vh;
    transform: scale(1.6);
    box-shadow: 0 0 0 100vmax rgba(30,30,50,0.08);
    z-index: 10;
}
.ss-viewer-close {
    position: absolute;
    top: 0.3em; right: 0.65em;
    z-index: 20002;
    font-size: 2.1rem;
    background: rgba(17, 17, 17, 0.78);
    border: none;
    color: #fff;
    text-shadow: 0 2px 24px #111a;
    cursor: pointer;
    opacity: 0.92;
    transition: opacity 0.18s, background 0.2s;
    padding: 0.12em 0.48em 0.18em 0.46em;
    line-height: 1;
    border-radius: 50%;
    box-shadow: 0 4px 22px 0 rgba(10,10,10,0.13);
    backdrop-filter: blur(5px);
}
.ss-viewer-close:hover { opacity: 1; background: rgba(17, 17, 17, 0.92);}
    `;
    document.head.appendChild(style);

    function closePopup() {
        const bg = document.querySelector('.ss-viewer-blur-bg');
        if (bg) bg.remove();
        document.body.style.overflow = '';
    }

    function openPopup(src, alt) {
        // Remove any leftover popups
        closePopup();

        document.body.style.overflow = 'hidden';

        // Create image
        const img = createEl('img', {
            src: src, alt: alt || '',
            class: 'ss-viewer-img',
            draggable: 'false',
        });

        img.addEventListener('click', function (e) {
            if (!img.classList.contains('ss-zoomed')) {
                img.classList.add('ss-zoomed');
            } else {
                img.classList.remove('ss-zoomed');
            }
            e.stopPropagation();
        });

        // Close with ESC key
        function escHandler(e) {
            if (e.key === 'Escape') closePopup();
        }

        // Close X button
        const closeBtn = createEl('button', {
            class: 'ss-viewer-close',
            title: 'Close',
            onclick: closePopup
        });
        closeBtn.innerHTML = '&times;';

        // Container for positioning close button properly
        const container = createEl('div', { class: 'ss-viewer-container', tabindex: 0 }, [img, closeBtn]);
        // Focus for ESC key
        setTimeout(() => container.focus(), 30);

        // Backdrop
        const bg = createEl('div', { class: 'ss-viewer-blur-bg' }, [container]);
        bg.addEventListener('click', e => {
            if (e.target === bg) closePopup();
        });
        // Prevent background scrolling
        window.addEventListener('keydown', escHandler, { once: true });

        document.body.appendChild(bg);

        // Remove keydown handler when popup is closed
        bg.addEventListener('remove', () => {
            window.removeEventListener('keydown', escHandler);
            document.body.style.overflow = '';
        });
    }

    // Attach click listeners to .screenshot images
    function setupStoreScreenshotViewer() {
        // Use delegation for later DOM changes as well
        document.body.addEventListener('click', function (e) {
            const target = e.target;
            if (target.classList && target.classList.contains('screenshot') && target.tagName === 'IMG') {
                e.preventDefault();
                openPopup(target.src, target.alt || '');
            }
        }, false);
    }

    // DOMContentLoaded in case script is loaded early
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupStoreScreenshotViewer);
    } else {
        setupStoreScreenshotViewer();
    }
})();