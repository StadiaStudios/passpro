document.addEventListener("DOMContentLoaded", function () {
    const style = document.createElement('style');
    style.textContent = `
        .sticky-bottom-navbar {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 50;
            background: rgb(30, 30, 30);
            border-radius: 32px;
            box-shadow: 0 4px 32px 0 rgba(0,0,0,0.20), 0 1.5px 4px 0 rgba(255,116,116,0.12);
            padding: 0.5rem 1.1rem;
            display: flex;
            gap: 1.7rem;
            align-items: center;
            min-width: 265px;
            max-width: 90vw;
        }
        .sticky-bottom-navbar a {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #ccc;
            text-decoration: none;
            font-size: 0.87rem;
            font-weight: 500;
            transition: color 0.25s, background 0.2s;
            cursor: pointer;
            min-width: 48px;
        }
        .sticky-bottom-navbar a.active, .sticky-bottom-navbar a:hover {
            color: #fff;
        }
        .sticky-bottom-navbar .navicon {
            font-size: 1.45rem;
            transition: color 0.25s;
        }
        @media (min-width: 768px) {
            .sticky-bottom-navbar {
                display: none!important;
            }
        }
    `;
    document.head.appendChild(style);

    const isSubPage = window.location.pathname.includes('/pages/');
    const basePath = isSubPage ? '../' : '';

    const nav = document.createElement('nav');
    nav.className = 'sticky-bottom-navbar';
    nav.innerHTML = `
        <a href="${basePath}index.html" data-page="dashboard-section" id="nav-dashboard">
            <span class="navicon"><i class="fas fa-home"></i></span>
            <span>Home</span>
        </a>
        <a href="${basePath}index.html" data-page="password-list-section" id="nav-passwords">
            <span class="navicon"><i class="fas fa-lock"></i></span>
            <span>Passwords</span>
        </a>
        <a href="${basePath}pages/card-vault.html" id="nav-card-vault">
            <span class="navicon"><i class="fas fa-wallet"></i></span>
            <span>Wallet</span>
        </a>
        <a href="${basePath}pages/generator.html" id="nav-generator">
            <span class="navicon"><i class="fas fa-key"></i></span>
            <span>Generator</span>
        </a>
        <a href="${basePath}themes.html" id="nav-themes">
            <span class="navicon"><i class="fas fa-palette"></i></span>
            <span>Themes</span>
        </a>
    `;
    document.body.appendChild(nav);

    function setActiveNavLink(pageId) {
        document.querySelectorAll('.sticky-bottom-navbar a').forEach(a => a.classList.remove('active'));
        if (!pageId) return;
        const active = document.querySelector(`.sticky-bottom-navbar a[data-page="${pageId}"]`);
        if (active) active.classList.add('active');
    }

    document.querySelectorAll('.sticky-bottom-navbar a[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (typeof window.showPage === 'function') {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                window.showPage(page);
                setActiveNavLink(page);
            }
        });
    });

    setTimeout(() => {
        if (typeof window.showPage === 'function') {
            let current = "dashboard-section";
            const dashboardSection = document.getElementById(current);
            if (dashboardSection && !dashboardSection.classList.contains('hidden')) {
                setActiveNavLink(current);
            } else {
                setActiveNavLink('password-list-section');
            }
        } else {
            const currentPath = window.location.pathname;
            document.querySelectorAll('.sticky-bottom-navbar a').forEach(a => {
                const href = a.getAttribute('href').replace('../', '');
                if (currentPath.includes(href) && href !== 'index.html') {
                    a.classList.add('active');
                }
            });
        }
    }, 50);
});