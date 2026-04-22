(function() {
    const slides = [
        {
            title: "PassPro Updated!",
            text: "V1.19.17 Now Includes IMPORTANT Bug Fixes to the loading screen, We also now have a few new themes",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.74 2.26L21 9"/><path d="M21 3v6h-6"/></svg>`
        },
        {
            title: "Card Vault Updates",
            text: "The Card Vault now has a Copy Feature for each item. And has a view mode instead of just a edit mode.",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><rect x="8" y="10" width="8" height="5" rx="1"/></svg>` 
        },
        {
            title: "New Report a Bug Feature",
            text: "Now as of April 22 of 2026. Users on PassPro can now report app bugs within the app. Bascially just changing the support Redirect url",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M12 10v9"/><path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M16 11a4 4 0 0 1-8 0v-2a4 4 0 0 1 8 0v2Z"/></svg>` 
        },
        {
            title: "Zero-Knowledge",
            text: "Always Remember your data is encrypted locally. Not even WE can see your passwords. Make sure you download your account and have a backup somewhere safe like a USB!",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
        }
    ];

    let currentIndex = 0;
    const VERSION_KEY = 'passpro_last_seen_version';
    const CURRENT_VERSION = '1.19.17'; 

    function hasSeenPopup() {
        try {
            return localStorage.getItem(VERSION_KEY) === CURRENT_VERSION;
        } catch (e) { return false; }
    }

    function markAsSeen() {
        try {
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        } catch (e) {}
    }

    function createPopup() {
        if (document.getElementById('passpro-update-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'passpro-update-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #09090b 80%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '99999',
            opacity: '0',
            transition: 'opacity 0.5s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            color: '#fff',
            overflow: 'hidden'
        });

        overlay.innerHTML = `
            <div id="popup-content" style="
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px;
                text-align: center;
                max-width: 500px;
                transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            ">
                <div id="popup-icon" style="margin-bottom: 40px; transition: all 0.5s ease; transform: translateY(20px); opacity: 0;"></div>
                <h2 id="popup-title" style="font-size: 32px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.025em; transition: all 0.5s ease; transform: translateY(20px); opacity: 0;"></h2>
                <p id="popup-text" style="font-size: 18px; color: #a1a1aa; line-height: 1.6; transition: all 0.5s ease; transform: translateY(20px); opacity: 0;"></p>
            </div>

            <div style="
                width: 100%;
                max-width: 400px;
                padding: 40px 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 32px;
            ">
                <div id="dots-container" style="display: flex; justify-content: center; gap: 10px;"></div>
                
                <button id="popup-next-btn" style="
                    width: 100%;
                    background-color: #6366f1;
                    color: white;
                    border: none;
                    padding: 18px;
                    border-radius: 16px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                    transition: transform 0.2s, background 0.2s;
                ">Next</button>
            </div>
        `;

        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        const nextBtn = overlay.querySelector('#popup-next-btn');
        nextBtn.addEventListener('click', handleNext);
        nextBtn.addEventListener('touchstart', () => nextBtn.style.transform = 'scale(0.98)');
        nextBtn.addEventListener('touchend', () => nextBtn.style.transform = 'scale(1)');

        updateSlide(true);
    }

    function updateSlide(isInitial = false) {
        const slide = slides[currentIndex];
        const iconContainer = document.getElementById('popup-icon');
        const titleEl = document.getElementById('popup-title');
        const textEl = document.getElementById('popup-text');
        const dotsContainer = document.getElementById('dots-container');
        const nextBtn = document.getElementById('popup-next-btn');

        const elements = [iconContainer, titleEl, textEl];

        if (!isInitial) {
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(-10px)';
            });
        }

        setTimeout(() => {
            iconContainer.innerHTML = slide.svg;
            titleEl.textContent = slide.title;
            textEl.textContent = slide.text;
            
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.style.width = i === currentIndex ? '32px' : '8px';
                dot.style.height = '8px';
                dot.style.borderRadius = '4px';
                dot.style.backgroundColor = i === currentIndex ? '#6366f1' : '#27272a';
                dot.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                dotsContainer.appendChild(dot);
            });

            nextBtn.textContent = currentIndex === slides.length - 1 ? "Get Started" : "Next";

            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, isInitial ? 0 : 300);
    }

    function handleNext() {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide();
        } else {
            closePopup();
        }
    }

    function closePopup() {
        const overlay = document.getElementById('passpro-update-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.querySelector('#popup-content').style.transform = 'scale(1.05)';
            setTimeout(() => {
                overlay.remove();
                markAsSeen();
            }, 500);
        }
    }

    function init() {
        if (!hasSeenPopup()) {
            setTimeout(createPopup, 1500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.PassProUpdate = {
        reset: function() {
            localStorage.removeItem(VERSION_KEY);
            location.reload();
        }
    };
})();