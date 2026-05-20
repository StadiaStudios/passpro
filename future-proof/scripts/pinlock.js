(function () {
    const protectedPages = ['passwords.html', 'settings.html'];
    const isUnlocked = sessionStorage.getItem('is_unlocked');
    const data = JSON.parse(localStorage.getItem('pm_data')) || {};
    if (
        !isUnlocked &&
        data.pin &&
        protectedPages.includes(location.pathname.split('/').pop())
    ) {
        location.replace('index.html');
    }

    const style = document.createElement('style');
    style.textContent = `
        .pin-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(18,18,18,0.98); z-index: 99999; display: flex;
            flex-direction: column; align-items: center; justify-content: center;
            color: #fff; font-family: system-ui, sans-serif;
            min-height: 100vh; min-width: 100vw;
        }
        .pin-lock-card {
            background: rgba(30,30,30,1);
            border-radius: 18px;
            box-shadow: 0 6px 36px rgba(0,0,0,0.60);
            padding: 42px 32px 36px 32px;
            max-width: 94vw;
            min-width: 320px;
            width: 375px;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: popInPinLock .19s cubic-bezier(.72,2.1,.59,.98);
        }
        @keyframes popInPinLock {
          0% { transform: scale(0.94); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
        .pin-lock-title {
            color: #bb86fc;
            font-size: 2rem;
            margin-bottom: 10px;
            font-weight: 700;
            letter-spacing: 0.01em;
            text-align: center;
        }
        .pin-lock-desc {
            color: #aaa;
            font-size: 1.01rem;
            margin-bottom: 16px;
            text-align: center;
            font-weight: 400;
        }
        .pin-lock-input-group {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 0.85rem;
            margin-bottom: 12px;
        }
        .pin-lock-icon-btn {
            background: none;
            border: none;
            outline: none;
            padding: 4px;
            margin-left: -2px;
            cursor: pointer;
            display: flex;
            align-items: center;
            height: 40px;
            width: 36px;
            border-radius: 7px;
            transition: background 0.15s;
        }
        .pin-lock-icon-btn:focus-visible, .pin-lock-icon-btn:hover {
            background: rgba(187,134,252,0.08);
        }
        .pin-lock-view-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.8em;
            height: 1.8em;
        }
        .pin-input {
            font-family: inherit;
            letter-spacing: 0.28em;
            padding: 14px 10px 14px 16px;
            text-align: center;
            font-size: 1.65rem;
            width: 100%;
            background: #18181c;
            color: #fff;
            border: 1.5px solid #444;
            border-radius: 10px;
            outline: none;
            box-shadow: 0 1px 0 #0004;
            transition: border-color 0.17s;
            caret-color: #bb86fc;
        }
        .pin-input:focus {
            border-color: #bb86fc;
        }
        .pin-error {
            color: #cf6679;
            text-align: center;
            margin-top: 8px;
            margin-bottom: 0;
            font-size: 1.01rem;
            min-height: 1.6em;
            font-weight: 500;
        }
        @media (max-width: 480px) {
            .pin-lock-card {
                padding: 26px 10px 26px 10px;
                min-width: 92vw;
                width: 98vw;
            }
            .pin-lock-title {
                font-size: 1.45rem;
            }
        }
    `;
    document.head.appendChild(style);

    if (!isUnlocked && data.pin) {
        document.addEventListener('DOMContentLoaded', () => {
            const overlay = document.createElement('div');
            overlay.className = 'pin-overlay';

            const card = document.createElement('div');
            card.className = 'pin-lock-card';
            card.innerHTML = `
                <div class="pin-lock-title">Pin Locked</div>
                <div class="pin-lock-desc">Enter your 4-digit PIN to unlock your vault.</div>
                <div class="pin-lock-input-group">
                    <input type="password" 
                        inputmode="numeric" 
                        pattern="[0-9]*"
                        autocomplete="off" 
                        id="pinInput"
                        class="pin-input" 
                        maxlength="4" 
                        placeholder="••••"
                        aria-label="PIN code"
                    >
                    <button class="pin-lock-icon-btn" id="viewPinBtn" type="button" tabindex="0" aria-label="Show/hide PIN">
                        <span class="pin-lock-view-icon" id="viewPinIcon">
                            <svg width="25" height="25" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                <ellipse cx="10" cy="10" rx="7.5" ry="5.5" fill="none"/>
                                <circle cx="10" cy="10" r="2" fill="#fff" fill-opacity="0.23"/>
                                <circle cx="10" cy="10" r="2.5" fill="none"/>
                                <path d="M3 10c1.5-3 5.5-6 7-6s5.5 3 7 6-5.5 6-7 6-5.5-3-7-6z"/>
                            </svg>
                        </span>
                    </button>
                </div>
                <p id="errorMsg" class="pin-error" role="alert" aria-live="polite"></p>
            `;

            overlay.appendChild(card);
            document.body.appendChild(overlay);

            const input = card.querySelector('#pinInput');
            const errorElm = card.querySelector('#errorMsg');
            const viewBtn = card.querySelector('#viewPinBtn');
            const viewIcon = card.querySelector('#viewPinIcon');

            input.focus();

            let pinVisible = false;

            function renderEye(open) {
                if (open) {
                    viewIcon.innerHTML = `
                        <svg width="25" height="25" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                            <ellipse cx="10" cy="10" rx="7.5" ry="5.5" fill="none"/>
                            <circle cx="10" cy="10" r="2" fill="#fff" fill-opacity="0.23"/>
                            <circle cx="10" cy="10" r="2.5" fill="none"/>
                            <path d="M3 10c1.5-3 5.5-6 7-6s5.5 3 7 6-5.5 6-7 6-5.5-3-7-6z"/>
                        </svg>
                    `;
                } else {
                    viewIcon.innerHTML = `
                        <svg width="25" height="25" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                            <ellipse cx="10" cy="10" rx="7.5" ry="5.5" fill="none"/>
                            <circle cx="10" cy="10" r="2.5" fill="none"/>
                            <path d="M3 10c1.5-3 5.5-6 7-6s5.5 3 7 6-5.5 6-7 6-5.5-3-7-6z"/>
                            <line x1="5" y1="15.5" x2="15" y2="4.5" />
                        </svg>
                    `;
                }
            }

            viewBtn.addEventListener('click', () => {
                pinVisible = !pinVisible;
                input.type = pinVisible ? "text" : "password";
                renderEye(pinVisible);
                input.focus({ preventScroll: true });
            });

            viewBtn.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    viewBtn.click();
                }
            });

            renderEye(false);

            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                if (value !== e.target.value) {
                    e.target.value = value;
                }
                errorElm.textContent = '';
                if (value.length === 4) {
                    if (value === String(data.pin)) {
                        sessionStorage.setItem('is_unlocked', 'true');
                        overlay.remove();
                    } else {
                        errorElm.textContent = 'Incorrect PIN';
                        e.target.value = '';
                        input.focus();
                    }
                }
            });

            input.addEventListener('paste', (e) => {
                const text = (e.clipboardData || window.clipboardData).getData('text');
                if (!/^\d{1,4}$/.test(text)) {
                    e.preventDefault();
                    errorElm.textContent = 'PIN must be numbers only';
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    let value = input.value.trim();
                    if (value.length === 4) {
                        if (value === String(data.pin)) {
                            sessionStorage.setItem('is_unlocked', 'true');
                            overlay.remove();
                        } else {
                            errorElm.textContent = 'Incorrect PIN';
                            input.value = '';
                            input.focus();
                        }
                    }
                }
            });

            const focusable = [input, viewBtn];
            let lastFocus = 0;
            card.addEventListener('keydown', (e) => {
                if (e.key === "Tab") {
                    lastFocus = (lastFocus + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
                    focusable[lastFocus].focus();
                    e.preventDefault();
                }
            });
        });
    }
})();