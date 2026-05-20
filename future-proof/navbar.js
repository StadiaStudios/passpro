document.addEventListener("DOMContentLoaded", () => {
    const navStyles = document.createElement('style');
    navStyles.textContent = `
        body {
            margin: 0;
            padding: 0;
        }
        .navbar-wrapper {
            position: sticky;
            top: 0;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 5vw;
            background: rgba(18, 18, 18, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
        .nav-left-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .hamburger {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 24px;
            height: 18px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
        }
        .hamburger span {
            display: block;
            width: 100%;
            height: 2px;
            background-color: #bb86fc;
            border-radius: 2px;
            transition: all 0.3s linear;
        }
        .nav-brand {
            font-size: 1.5rem;
            font-weight: 800;
            color: #bb86fc;
            text-decoration: none;
            letter-spacing: 0.5px;
            transition: color 0.2s;
        }
        .nav-links {
            display: flex;
            gap: 25px;
        }
        .nav-links a {
            position: relative;
            color: #aaa;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            padding-bottom: 5px;
            transition: color 0.2s;
        }
        .nav-links a::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #bb86fc, #03dac6);
            opacity: 0;
            transform: scaleX(0);
            transition: opacity 0.25s, transform 0.25s;
            border-radius: 2px;
        }
        .nav-links a:hover,
        .nav-links a:focus {
            color: #bb86fc;
        }
        .nav-links a:hover::after,
        .nav-links a:focus::after {
            opacity: 1;
            transform: scaleX(1);
        }
        .mobile-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 1001;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .mobile-drawer {
            position: fixed;
            top: 0; left: -280px;
            width: 280px;
            height: 100vh;
            background: #1e1e1e;
            z-index: 1002;
            box-shadow: 4px 0 15px rgba(0,0,0,0.5);
            transition: left 0.3s cubic-bezier(0.4,0,0.2,1);
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
        }
        .mobile-drawer-header {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            border-bottom: 1px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
            position: relative;
            min-height: 46px;
        }
        .mobile-drawer-header .nav-brand {
            flex: 1 1 auto;
            text-align: left;
            margin-right: auto;
            z-index: 1;
        }
        .mobile-drawer-header .close-btn {
            margin-left: auto;
        }
        .close-btn {
            background: none;
            border: none;
            color: #aaa;
            font-size: 1.95rem;
            cursor: pointer;
            line-height: 1;
            padding: 5px 8px 3px 8px;
            border-radius: 50%;
            box-sizing: content-box;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.15s, background 0.15s;
        }
        .close-btn:focus-visible {
            outline: 2px solid #bb86fc;
            outline-offset: 1px;
        }
        .close-btn:hover,
        .close-btn:focus {
            color: #cf6679;
            background: rgba(207,102,121,0.08);
        }
        .mobile-drawer a {
            color: #e0e0e0;
            text-decoration: none;
            font-size: 1.1rem;
            font-weight: bold;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            transition: color 0.2s;
        }
        .mobile-drawer a:hover,
        .mobile-drawer a:focus {
            color: #bb86fc;
        }
        .mobile-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        .mobile-drawer.active {
            left: 0;
        }
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            .hamburger {
                display: flex;
            }
        }
    `;
    document.head.appendChild(navStyles);

    // Navbar markup
    const navHTML = `
        <div class="mobile-overlay" id="mobileOverlay"></div>
        <nav class="mobile-drawer" id="mobileDrawer" aria-label="Mobile navigation">
            <div class="mobile-drawer-header">
                <span class="nav-brand" tabindex="0">PassPro</span>
                <button class="close-btn" id="closeDrawerBtn" aria-label="Close Menu" type="button">&times;</button>
            </div>
            <a href="index.html" tabindex="0">Add New</a>
            <a href="passwords.html" tabindex="0">Passwords</a>
            <a href="settings.html" tabindex="0">Settings</a>
        </nav>
        <div class="navbar-wrapper">
            <div class="nav-left-container">
                <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" type="button">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <a href="index.html" class="nav-brand" tabindex="0">PassPro</a>
            </div>
            <div class="nav-links" role="navigation" aria-label="Main navigation">
                <a href="index.html" tabindex="0">Add New</a>
                <a href="passwords.html" tabindex="0">Passwords</a>
                <a href="settings.html" tabindex="0">Settings</a>
            </div>
        </div>
    `;

    const navContainer = document.getElementById('nav-placeholder');
    if (!navContainer) return;
    navContainer.innerHTML = navHTML;

    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function trapFocus(element) {
        const focusableSelectors = [
            'a[href]', 'button:not([disabled])', '[tabindex]:not([tabindex="-1"])', 'input:not([type="hidden"])'
        ];
        const focusable = () => Array.from(element.querySelectorAll(focusableSelectors.join(',')))
            .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
        function keyHandler(e) {
            if (!mobileDrawer.classList.contains('active')) return;
            const items = focusable();
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            } else if (e.key === 'Escape') {
                closeMenu();
            }
        }
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }
    let untrap = null;

    function openMenu() {
        mobileDrawer.classList.add('active');
        mobileOverlay.classList.add('active');
        // Focus first focusable link in drawer
        setTimeout(() => {
            const firstLink = mobileDrawer.querySelector('a,button');
            if (firstLink) firstLink.focus();
        }, 80);
        untrap = trapFocus(mobileDrawer);
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        mobileDrawer.classList.remove('active');
        mobileOverlay.classList.remove('active');
        if (untrap) { untrap(); untrap = null; }
        hamburgerBtn.focus();
        document.body.style.overflow = '';
    }
    function toggleMenu() {
        if (mobileDrawer.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    hamburgerBtn.addEventListener('click', toggleMenu);
    closeDrawerBtn.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);

    mobileDrawer.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    mobileDrawer.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', closeMenu)
    );
});