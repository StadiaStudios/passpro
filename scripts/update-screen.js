(function () {
    const slides = [
        {
            title: "Welcome to PassPro!",
            text: "This is the latest version of PassPro, redesigned for speed, simplicity, and powerful new features. Your passwords and secrets are still protected with modern zero-knowledge encryption.",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 4v5c0 5.25-7 9-7 9s-7-3.75-7-9V7l7-4z"/><circle cx="12" cy="12" r="3"/><path d="M12 12v2.5"/><path d="M12 16h.01"/></svg>`
        },
        {
            title: "Your Data, Your Device",
            text: "Everything is stored securely in your browser using local encryption no cloud by default. Settings and account data are managed right from the Settings page.",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M8 20h8"/><path d="M12 16v4"/></svg>`
        },
        {
            title: "Easy Backup & Sync",
            text: "Export your vault safely from <b>Settings > Export Data</b>. Import anytime using <b>Settings > Import Data.</b> You can keep a backup on your computer or a USB drive for extra security. iCloud And Device Backup should include data as well!",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16l-4 4-4-4"/><path d="M12 12v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 16.25"/><rect x="10" y="20" width="4" height="2" rx="1"/></svg>`
        },
        {
            title: "Switch or Reset Fast",
            text: "Manage migrations, reset your account, and toggle between Classic PassPro and New PassPro from <b>Settings</b>. Looking for more help? Tap <b>Help</b> at any time, or review docs on the homepage.",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v5h.582M19.418 4A9 9 0 1 0 21 12.35"/><path d="M20 9V4h-5"/></svg>`
        },
        {
            title: "Zero-Knowledge",
            text: "Always remember your data is encrypted locally – not even WE can see your passwords. Make sure you download your account and have a backup somewhere safe, like a USB!",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
        }
    ];

    let currentIndex = 0;
    const VERSION_KEY = 'passpro_2024_welcome_seen';
    const CURRENT_VERSION = '1.24.22';

    function hasSeenPopup() {
        try {
            return localStorage.getItem(VERSION_KEY) === CURRENT_VERSION;
        } catch {
            return false;
        }
    }

    function markAsSeen() {
        try {
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        } catch {}
    }

    function createAnimatedBG(overlay) {
        const canvas = document.createElement('canvas');
        canvas.id = 'passpro-bg-canvas';
        Object.assign(canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '0',
            pointerEvents: 'none'
        });
        overlay.appendChild(canvas);

        let W = window.innerWidth, H = window.innerHeight;
        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        }
        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d');
        const swirls = Array.from({ length: 5 }, (_, i) => ({
            cx: Math.random() * W,
            cy: Math.random() * H,
            angle: Math.random() * Math.PI * 2,
            radius: 180 + Math.random() * 140,
            speed: (0.004 + 0.001 * Math.random()) * (i % 2 === 0 ? 1 : -1),
            color: [
                `hsla(${230 + i * 24},80%,75%,${0.17 + 0.11 * Math.random()})`,
                `hsla(${330 - i * 20},75%,55%,${0.22 + 0.10 * Math.random()})`
            ],
        }));

        function loop() {
            ctx.clearRect(0, 0, W, H);
            swirls.forEach((s, idx) => {
                s.angle += s.speed;
                s.cx = W / 2 + Math.cos(s.angle + idx) * (W / 3.5 + idx * 27);
                s.cy = H / 2 + Math.sin(s.angle + idx / 2) * (H / 3.1 + idx * 26);

                let grd = ctx.createRadialGradient(s.cx, s.cy, 10, s.cx, s.cy, s.radius);
                grd.addColorStop(0, s.color[0]);
                grd.addColorStop(1, s.color[1]);
                ctx.save();
                ctx.globalAlpha = 0.62;
                ctx.globalCompositeOperation = 'lighter';
                ctx.beginPath();
                ctx.arc(s.cx, s.cy, s.radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = grd;
                ctx.filter = "blur(6px)";
                ctx.fill();
                ctx.restore();
            });
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    function createPopup() {
        if (document.getElementById('passpro-update-overlay')) return;

        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) navPlaceholder.style.display = 'none';

        const overlay = document.createElement('div');
        overlay.id = 'passpro-update-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            width: '100vw',
            height: '100vh',
            background: '#09090b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '100002',
            opacity: '0',
            transition: 'opacity 0.45s cubic-bezier(.51,.15,.32,.98)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            color: '#fff',
            overflow: 'hidden',
            pointerEvents: 'auto'
        });

        createAnimatedBG(overlay);

        const innerBGDiv = document.createElement('div');
        Object.assign(innerBGDiv.style, {
            position: 'relative',
            zIndex: '1',
            width: '100vw',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        });

        innerBGDiv.innerHTML = `
            <button id="popup-close-btn" aria-label="Close" style="
                position: absolute;
                top: 30px;
                right: 35px;
                z-index: 10;
                background: rgba(18,18,22,0.63);
                border: none;
                border-radius: 100px;
                font-size: 26px;
                font-weight: 700;
                color: #c7d3fc;
                width: 46px;
                height: 46px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 10px 0 #23227228;
                transition: background 0.23s;
            ">&times;</button>
            <div id="popup-content" style="
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px;
                text-align: center;
                max-width: 500px;
                margin: 0 auto;
                transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                backdrop-filter: blur(10px) brightness(1.025);
                background: rgba(22,20,46,0.42);
                border-radius: 29px;
                box-shadow: 0 8px 38px 0 #21214177;
                border: 2.5px solid rgba(99,102,241,0.13);
            ">
                <div id="popup-icon" style="margin-bottom: 38px; transition: all 0.5s ease; transform: translateY(20px); opacity: 0;"></div>
                <h2 id="popup-title" style="font-size: 30px; font-weight: 800; margin-bottom: 14px; letter-spacing: -0.025em; transition: all 0.5s ease; transform: translateY(20px); opacity: 0; text-shadow:0 2px 15px #1b1b3340;"></h2>
                <p id="popup-text" style="font-size: 18px; color: #a1a1aa; line-height: 1.6; transition: all 0.5s ease; transform: translateY(20px); opacity: 0; text-shadow:0 2px 12px #14100844;"></p>
            </div>
            <div style="
                width: 100%;
                max-width: 400px;
                padding: 38px 24px 35px 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 31px;
            ">
                <div id="dots-container" style="display: flex; justify-content: center; gap: 10px;"></div>
                <button id="popup-next-btn" style="
                    width: 100%;
                    background: linear-gradient(90deg, #a78bfa 5%, #6366f1 55%, #0ea5e9 100%);
                    color: white;
                    border: none;
                    padding: 18px;
                    border-radius: 16px;
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    cursor: pointer;
                    box-shadow: 0 10px 20px -3px rgba(99, 102, 241, 0.31),0 2px 8px #4338ca77;
                    transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
                ">Next</button>
            </div>
        `;

        overlay.appendChild(innerBGDiv);
        document.body.appendChild(overlay);

        const oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 30);

        const nextBtn = overlay.querySelector('#popup-next-btn');
        nextBtn.addEventListener('click', handleNext);
        nextBtn.addEventListener('touchstart', () => nextBtn.style.transform = 'scale(0.97)');
        nextBtn.addEventListener('touchend', () => nextBtn.style.transform = 'scale(1)');

        overlay.querySelector('#popup-close-btn').addEventListener('click', function() {
            closePopup(false);
        });

        function escListener(e) {
            if (e.key === "Escape") closePopup(false);
        }
        window.addEventListener('keydown', escListener);

        setTimeout(() => {
            nextBtn.focus();
        }, 50);

        updateSlide(true);

        overlay.cleanupPopup = function () {
            window.removeEventListener('keydown', escListener);
            document.body.style.overflow = oldOverflow;
            if (navPlaceholder) navPlaceholder.style.display = '';
        }
    }

    function updateSlide(isInitial = false) {
        const slide = slides[currentIndex];
        const iconContainer = document.getElementById('popup-icon');
        const titleEl = document.getElementById('popup-title');
        const textEl = document.getElementById('popup-text');
        const dotsContainer = document.getElementById('dots-container');
        const nextBtn = document.getElementById('popup-next-btn');
        if (!iconContainer || !titleEl || !textEl || !dotsContainer || !nextBtn) return;

        const elements = [iconContainer, titleEl, textEl];
        if (!isInitial) {
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(-12px)';
            });
        }
        setTimeout(() => {
            iconContainer.innerHTML = slide.svg;
            titleEl.textContent = slide.title;
            textEl.innerHTML = slide.text;

            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.style.width = i === currentIndex ? '30px' : '8px';
                dot.style.height = '8px';
                dot.style.borderRadius = '4px';
                dot.style.background = i === currentIndex
                    ? "linear-gradient(90deg, #a78bfa 0, #6366f1 55%, #0ea5e9 100%)"
                    : '#27272a';
                dot.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
                dot.style.boxShadow = i === currentIndex ? "0 2px 10px #6366f181" : '';
                dotsContainer.appendChild(dot);
            });

            nextBtn.textContent = currentIndex === slides.length - 1 ? "Let's Go!" : "Next";

            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 110);
            });
        }, isInitial ? 0 : 260);
    }

    function handleNext() {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide();
        } else {
            closePopup(true);
        }
    }

    function closePopup(markAsSeenFlag) {
        const overlay = document.getElementById('passpro-update-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            const popupContent = overlay.querySelector('#popup-content');
            if (popupContent) popupContent.style.transform = 'scale(1.03)';
            setTimeout(() => {
                if (overlay.cleanupPopup) overlay.cleanupPopup();
                overlay.remove();
                if (markAsSeenFlag) markAsSeen();
            }, 390);
        }
    }

    function init() {
        const allowed = /(\/index\.html|\/settings\.html|\bindex\b|\bsettings\b)/i.test(location.pathname) ||
            document.body.dataset.page === "index" ||
            document.body.dataset.page === "settings";
        if (allowed && !hasSeenPopup()) {
            setTimeout(createPopup, 1000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.PassProUpdate = {
        reset: function () {
            localStorage.removeItem(VERSION_KEY);
            location.reload();
        },
        show: function () {
            createPopup();
        }
    };
})();