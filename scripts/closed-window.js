(function () {
    const BLUR_STYLE_ID = 'security-blur-style';
    const OVERLAY_ID = 'security-blur-overlay';

    function createOverlay() {
        if (document.getElementById(OVERLAY_ID)) return;

        if (!document.getElementById(BLUR_STYLE_ID)) {
            const style = document.createElement('style');
            style.id = BLUR_STYLE_ID;
            style.textContent = `
                body.security-blur-active > *:not(#${OVERLAY_ID}):not(script) {
                    filter: blur(5px) brightness(0.7) !important;
                    pointer-events: none !important;
                    user-select: none !important;
                }
                #${OVERLAY_ID} {
                    position: fixed;
                    z-index: 999999;
                    inset: 0;
                    background: rgba(18,18,18,0.73);
                    pointer-events: auto;
                    -webkit-backdrop-filter: blur(5px);
                    backdrop-filter: blur(5px);
                }
                @keyframes security-blur-fadein {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.setAttribute('role', 'presentation');
        overlay.setAttribute('tabindex', '-1');

        const removeBlur = () => {
            document.body.classList.remove('security-blur-active');
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        };

        overlay.addEventListener('click', removeBlur);
        overlay.addEventListener('keydown', (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                removeBlur();
            }
        });

        document.body.appendChild(overlay);
        document.body.classList.add('security-blur-active');
    }

    function removeOverlay() {
        document.body.classList.remove('security-blur-active');
        const overlay = document.getElementById(OVERLAY_ID);
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden || document.visibilityState !== 'visible') {
            createOverlay();
        } else {
            removeOverlay();
        }
    });

    window.addEventListener('blur', function () {
        createOverlay();
    });

    window.addEventListener('focus', function () {
        removeOverlay();
    });

    document.addEventListener('mouseleave', function (e) {
        if (!e.relatedTarget && !e.toElement) {
            createOverlay();
        }
    });

    document.addEventListener('mouseenter', function () {
        removeOverlay();
    });

    if (document.hidden || document.visibilityState !== 'visible') {
        createOverlay();
    }

    window.addEventListener('beforeunload', removeOverlay);

    window.SecurityBlur = {
        activate: createOverlay,
        deactivate: removeOverlay
    };
})();