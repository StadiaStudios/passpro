(function() {
    const slides = [
        {
            title: "PassPro Updated!",
            text: "In V1.18.16 Users now have a New Digital Wallet System within their PassPro App! Try it Now",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M21 9v2"/><path d="M17 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>`        
        },
        {
            title: "V1.18.16 Notes",
            text: "Following This we added a Export Cards and Import Cards System so that way you never lose them. But Remember these are two seperate files for your Passwords And Cards",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><rect x="5" y="14" width="4" height="2" rx="0.5"/></svg>`
        },
        {
            title: "Contact Us Now Feature!",
            text: "We also now have a Contact Us Feature you can click through settings that way if you dont join our discord you can reach us via Email.",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
        },
        {
            title: "Zero-Knowledge",
            text: "Always Remember your data is encrypted locally. Not even WE can see your passwords. Make sure you download your account and have a backup somewhere safe like a USB!",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
        },
        {
            title: "Terms Of Service Updates",
            text: "Following the New Digital Wallet Updates, This comes with new Terms Of Service! Please make sure you read and agree to the Terms Of Service at all times!",
            svg: `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`     
        }
    ];

    let currentIndex = 0;
    const VERSION_KEY = 'passpro_last_seen_version';
    const CURRENT_VERSION = '1.18.16'; 

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