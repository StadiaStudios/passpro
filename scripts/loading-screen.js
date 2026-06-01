(function () {
    if (sessionStorage.getItem("__passpro_loading_shown")) {
        return;
    }
    document.addEventListener('DOMContentLoaded', () => {
        sessionStorage.setItem("__passpro_loading_shown", "1");

        const style = document.createElement('style');
        style.id = '__passpro_loading_hide_all';
        style.textContent = `
            html, body {
                visibility: hidden !important;
                overflow: hidden !important;
            }
            #cursor-temp-loading-overlay {
                visibility: visible !important;
            }
            #nav-placeholder, #nav-placeholder * {
                visibility: hidden !important;
            }
            ::-webkit-scrollbar {
                display: none !important;
            }
            html {
                scrollbar-width: none !important;
            }
            body {
                -ms-overflow-style: none !important;
            }
        `;
        document.head.appendChild(style);

        const overlayStyle = document.createElement('style');
        overlayStyle.id = '__passpro_loading_overlay_css';
        overlayStyle.textContent = `
            #cursor-temp-loading-overlay {
                position: fixed;
                inset: 0;
                background-color: #050505 !important;
                z-index: 100000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: opacity 0.36s cubic-bezier(.77, .16, .4, 1.07);
                opacity: 1;
                visibility: visible;
                overflow: hidden;
            }
            
            /* Moving liquid blobs behind the glass */
            #cursor-temp-loading-overlay::before {
                content: '';
                position: absolute;
                width: 150vw;
                height: 150vh;
                top: -25vh;
                left: -25vw;
                background: 
                    radial-gradient(circle at 35% 35%, rgba(60, 90, 180, 0.8) 0%, transparent 20%),
                    radial-gradient(circle at 65% 65%, rgba(40, 70, 140, 0.7) 0%, transparent 25%),
                    radial-gradient(circle at 40% 70%, rgba(90, 50, 150, 0.6) 0%, transparent 20%);
                animation: liquidMovement 8s ease-in-out infinite alternate;
                z-index: 0;
                pointer-events: none;
                will-change: transform;
            }

            /* Frosted glass layer */
            #cursor-temp-loading-overlay::after {
                content: '';
                position: absolute;
                inset: 0;
                background: rgba(10, 10, 15, 0.35);
                backdrop-filter: blur(18px) saturate(140%);
                -webkit-backdrop-filter: blur(18px) saturate(140%);
                box-shadow: inset 0 0 100px rgba(255, 255, 255, 0.03);
                z-index: 1;
                pointer-events: none;
            }

            @keyframes liquidMovement {
                0% { transform: translate(-10%, -10%) scale(1) rotate(0deg); }
                50% { transform: translate(10%, 5%) scale(1.1) rotate(5deg); }
                100% { transform: translate(-5%, 15%) scale(0.9) rotate(-5deg); }
            }

            /* Content lifted above the glass layer */
            .cursor-lock-anim-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-bottom: 24px;
                min-height: 120px;
                position: relative;
                z-index: 2; 
            }
            .cursor-loading-png {
                width: 76px;
                height: 76px;
                display: block;
                filter: drop-shadow(0 4px 22px #22335a38);
                border-radius: 20px;
                animation: pngPopIn 1.1s cubic-bezier(.37,1.41,.41,1.06) 60ms both, pngBounce 1.16s cubic-bezier(.23,.99,.49,1.16) 1s infinite;
            }
            @keyframes pngPopIn {
                0% { transform: scale(.75) translateY(32px); opacity: 0;}
                50% { transform: scale(1.08) translateY(-7px); opacity: 1;}
                76% { transform: scale(.96) translateY(3px);}
                100% { transform: scale(1) translateY(0);}
            }
            @keyframes pngBounce {
                0%, 100% { transform: scale(1) translateY(0);}
                24% { transform: scale(.995, 1.06) translateY(-3px);}
                49% { transform: scale(1.01, .95) translateY(4px);}
                74% { transform: scale(.997, 1.03) translateY(-2px);}
            }
            .cursor-lock-text {
                color: #e7eafb;
                font-family: 'Inter', system-ui, sans-serif;
                font-size: 1.19rem;
                font-weight: 600;
                letter-spacing: 0.012em;
                text-shadow: 0 3px 18px #141b3a72;
                opacity: 0.99;
                user-select: none;
                margin-top: 8px;
                margin-bottom: 0;
                text-align: center;
                position: relative;
                z-index: 2; 
            }
        `;
        document.head.appendChild(overlayStyle);

        const overlay = document.createElement('div');
        overlay.id = 'cursor-temp-loading-overlay';

        const animBox = document.createElement('div');
        animBox.className = 'cursor-lock-anim-box';
        animBox.innerHTML = `
            <img 
                class="cursor-loading-png"
                src="assets/loader.png"
                alt="Loading..." 
                draggable="false"
            />
        `;

        const text = document.createElement('div');
        text.className = 'cursor-lock-text';
        text.textContent = "Loading PassPro...";

        overlay.appendChild(animBox);
        overlay.appendChild(text);

        document.body.appendChild(overlay);

        const minDisplayMs = 4000;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsed = Date.now() - startTime;
            const removeOverlay = () => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    if (style.parentNode) style.parentNode.removeChild(style);
                    if (overlayStyle.parentNode) overlayStyle.parentNode.removeChild(overlayStyle);
                    document.documentElement.style.overflow = "";
                    document.body.style.overflow = "";
                }, 420);
            };
            if (elapsed < minDisplayMs) {
                setTimeout(removeOverlay, minDisplayMs - elapsed);
            } else {
                removeOverlay();
            }
        });
    });
})();