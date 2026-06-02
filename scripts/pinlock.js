(function () {
    const protectedPages = ['passwords.html', 'settings.html'];
    const isUnlocked = sessionStorage.getItem('is_unlocked');
    const data = JSON.parse(localStorage.getItem('pm_data')) || {};

    const COOLDOWN_MINUTES = 10;
    const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;
    const MAX_ATTEMPTS = 3;
    const ATTEMPT_KEY = '__pinlock_attempts_v1';
    const COOLDOWN_KEY = '__pinlock_cooldown_until_v1';

    function getAttempts() {
        let val = localStorage.getItem(ATTEMPT_KEY);
        return val ? parseInt(val, 10) || 0 : 0;
    }
    function setAttempts(n) {
        localStorage.setItem(ATTEMPT_KEY, String(n));
    }
    function clearAttempts() {
        localStorage.removeItem(ATTEMPT_KEY);
    }
    function getCooldownUntil() {
        let val = localStorage.getItem(COOLDOWN_KEY);
        return val ? parseInt(val, 10) || 0 : 0;
    }
    function setCooldownUntil(ts) {
        localStorage.setItem(COOLDOWN_KEY, String(ts));
    }
    function clearCooldown() {
        localStorage.removeItem(COOLDOWN_KEY);
    }
    function isCooldownActive() {
        const until = getCooldownUntil();
        return until && Date.now() < until;
    }
    function getCooldownRemainingMs() {
        const until = getCooldownUntil();
        return Math.max(0, until - Date.now());
    }

    function isPermanentlyLocked() {
        return false;
    }

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
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(12,12,12,0.98);
            z-index: 99999;
            color: #fff;
            font-family: 'Inter', system-ui, sans-serif;
            padding: 4vw;
            box-sizing: border-box;
        }
        .pin-lock-card {
            background: linear-gradient(134deg, #171717 70%, #111 100%);
            border-radius: 22px;
            box-shadow: 0 6px 50px rgba(10,10,10,0.22), 0 2px 8px #000c;
            max-width: 400px;
            width: 100%;
            min-width: 0;
            padding: 40px 33px 22px 33px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.2rem 0;
            animation: popInPinLock .21s cubic-bezier(.72,2.1,.59,.98);
            box-sizing: border-box;
            border: 1.5px solid #232323;
        }
        @keyframes popInPinLock {
            0% { transform: scale(0.93); opacity: 0 }
            100% { transform: scale(1); opacity: 1 }
        }
        .pin-lock-title {
            color: #e2e2e2;
            font-size: 2.12rem;
            margin-bottom: 8px;
            font-weight: 800;
            letter-spacing: 0.01em;
            text-align: center;
        }
        .pin-lock-desc {
            color: #bbbbbb;
            font-size: 1.04rem;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        }
        .pin-lock-input-group {
            width: 100%;
            display: flex;
            align-items: stretch;
            gap: 0.66rem;
            margin-bottom: 9px;
        }
        .pin-lock-icon-btn {
            background: none;
            border: none;
            outline: none;
            padding: 0 8px 0 4px;
            margin-left: -4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            height: 46px;
            width: 44px;
            border-radius: 8px;
            transition: background 0.12s;
        }
        .pin-lock-icon-btn:focus-visible, .pin-lock-icon-btn:hover {
            background: rgba(120,120,120,0.13);
        }
        .pin-lock-view-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.1em;
            height: 2.1em;
        }
        .pin-input {
            font-family: inherit;
            letter-spacing: 0.38em;
            padding: 16px 12px 16px 18px;
            text-align: center;
            font-size: 1.82rem;
            width: 100%;
            outline: none;
            background:rgb(27, 27, 27);
            color: #fff;
            border: 1.5px solid #222;
            border-radius: 12px;
            box-shadow: 0 2px 0 #0003;
            transition: border-color 0.13s;
            caret-color: #e2e2e2;
            box-sizing: border-box;
        }
        input[type="password"].pin-input::-ms-reveal,
        input[type="password"].pin-input::-ms-clear {
            display: none;
        }
        input[type="password"].pin-input::-webkit-credentials-auto-fill-button,
        input[type="password"].pin-input::-webkit-textfield-decoration-container,
        input[type="password"].pin-input::-webkit-input-password-toggle-button {
            display: none !important;
            pointer-events: none;
            opacity: 0;
            width: 0;
            height: 0;
        }
        input[type="password"].pin-input::-webkit-input-placeholder { color: #888; }
        input[type="password"].pin-input::-webkit-contacts-auto-fill-button,
        input[type="password"].pin-input::-webkit-clear-button {
            display: none !important;
        }
        input[type="password"].pin-input::-moz-input-password-toggle-button {
            display: none !important;
        }
        .pin-input:focus {
            border-color: #fff;
        }
        .pin-error {
            color: #e36c7c;
            text-align: center;
            margin: 7px 0 0 0;
            font-size: 1.06rem;
            min-height: 1.65em;
            font-weight: 500;
            width: 100%;
        }
        .pin-lock-actions {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            margin-top: 13px;
            margin-bottom: 2px;
            gap: 10px;
        }
        .pin-unlock-btn {
            padding: 11px 32px;
            background: linear-gradient(97deg, #313131 55%, #111 120%);
            color: #fff;
            font-size: 1.06rem;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.15s, box-shadow 0.11s;
            margin-left: auto;
            box-shadow: 0 1px 7px #14111118;
            outline: none;
        }
        .pin-unlock-btn:focus, .pin-unlock-btn:hover {
            background: linear-gradient(97deg, #444 55%, #181818 120%);
            box-shadow: 0 4px 9px 0 #34343430;
        }
        .forgot-pin-link {
            color: #aaa !important;
            background: none !important;
            border: none;
            padding: 0;
            margin: 0;
            font-size: 0.98rem;
            text-decoration: underline;
            cursor: pointer;
            transition: color 0.14s;
            font-weight: 500;
            outline: none;
            float: right;
            margin-left: auto;
        }
        .forgot-pin-link:hover,
        .forgot-pin-link:focus {
            color: #fff !important;
            background: none !important;
        }
        .second-recovery-link {
            color: #aaa !important;
            background: none !important;
            border: none;
            padding: 0;
            margin: 0;
            font-size: 0.98rem;
            text-decoration: underline;
            cursor: pointer;
            transition: color 0.14s;
            font-weight: 500;
            outline: none;
        }
        .second-recovery-link:hover,
        .second-recovery-link:focus {
            color: #fff !important;
            background: none !important;
        }
        .pin-input::placeholder {
            color: #888;
            letter-spacing: 0.02em;
            opacity: 1;
        }
        @media (max-width: 540px) {
            .pin-overlay {
                padding: 0;
            }
            .pin-lock-card {
                border-radius: 15px;
                max-width: 98vw;
                width: 99vw;
                padding: 32px 4vw 16px 4vw;
                min-width: 0;
            }
            .pin-input {
                padding: 13px 9px 13px 14px;
                font-size: 1.33rem;
            }
            .pin-lock-title {
                font-size: 1.23rem;
            }
            .pin-lock-desc {
                font-size: 0.99rem;
            }
        }
        @media (max-width: 385px) {
            .pin-lock-card { padding: 18px 2vw; }
            .pin-lock-title { font-size: 0.97rem; }
        }
        .pin-cooldown-msg {
            color: #e6af2e;
            background: none;
            font-size: 1.09rem;
            margin: 9px auto 6px auto;
            text-align: center;
            min-height: 2em;
            transition: color .25s;
            font-weight: 600;
        }
        .pin-final-lock-msg {
            color: #e94f18;
            background: none;
            font-size: 1.12rem;
            margin: 15px auto 8px auto;
            text-align: center;
            min-height: 2.5em;
            font-weight: 800;
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
                <div class="pin-lock-title">App Locked</div>
                <div class="pin-lock-desc">Enter your 4-digit PIN to unlock your vault.</div>
                <form id="pinLockForm" autocomplete="off" tabindex="0" style="width:100%;display:flex;flex-direction:column;align-items:center;">
                    <div class="pin-lock-input-group">
                        <input
                            type="tel"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            autocomplete="off"
                            id="pinInput"
                            class="pin-input"
                            maxlength="4"
                            placeholder="PIN"
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
                    <p id="cooldownMsg" class="pin-cooldown-msg" style="display:none;"></p>
                    <p id="finalLockMsg" class="pin-final-lock-msg" style="display:none;"></p>
                    <div class="pin-lock-actions" style="flex-direction: column; align-items: flex-start;">
                        <div style="display: flex; gap: 10px; width: 100%;">
                            <button type="button" class="forgot-pin-link" id="forgotPinBtn" tabindex="0">Forgot PIN?</button>
                            <button type="button" class="second-recovery-link" id="secondRecoveryBtn" tabindex="0">2nd Recovery</button>
                        </div>
                        <button type="submit" id="unlockBtn" class="pin-unlock-btn" tabindex="0" style="margin-top:12px;">Unlock</button>
                    </div>
                </form>
            `;

            overlay.appendChild(card);
            document.body.appendChild(overlay);

            const form = card.querySelector('#pinLockForm');
            const input = card.querySelector('#pinInput');
            const errorElm = card.querySelector('#errorMsg');
            const cooldownElm = card.querySelector('#cooldownMsg');
            const finalLockElm = card.querySelector('#finalLockMsg');
            const viewBtn = card.querySelector('#viewPinBtn');
            const viewIcon = card.querySelector('#viewPinIcon');
            const unlockBtn = card.querySelector('#unlockBtn');
            const forgotBtn = card.querySelector('#forgotPinBtn');
            const secondRecoveryBtn = card.querySelector('#secondRecoveryBtn');

            let pinVisible = false;
            let cooldownTimer = null;

            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
            input.setAttribute('maxlength', '4');
            input.setAttribute('autocomplete', 'new-password');
            input.setAttribute('autocapitalize', 'off');
            input.setAttribute('autocorrect', 'off');
            input.type = 'tel';

            function renderEye(open) {
                if (open) {
                    viewIcon.innerHTML = `
                        <svg width="25" height="25" viewBox="0 0 20 20" fill="none" stroke="#ddd" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                            <ellipse cx="10" cy="10" rx="7.5" ry="5.5" fill="none"/>
                            <circle cx="10" cy="10" r="2" fill="#fff" fill-opacity="0.23"/>
                            <circle cx="10" cy="10" r="2.5" fill="none"/>
                            <path d="M3 10c1.5-3 5.5-6 7-6s5.5 3 7 6-5.5 6-7 6-5.5-3-7-6z"/>
                        </svg>
                    `;
                } else {
                    viewIcon.innerHTML = `
                        <svg width="25" height="25" viewBox="0 0 20 20" fill="none" stroke="#ccc" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                            <ellipse cx="10" cy="10" rx="7.5" ry="5.5" fill="none"/>
                            <circle cx="10" cy="10" r="2.5" fill="none"/>
                            <path d="M3 10c1.5-3 5.5-6 7-6s5.5 3 7 6-5.5 6-7 6-5.5-3-7-6z"/>
                            <line x1="5" y1="15.5" x2="15" y2="4.5" />
                        </svg>
                    `;
                }
            }

            function setPinVisible(isVisible) {
                pinVisible = isVisible;
                input.type = pinVisible ? 'text' : 'tel';
                renderEye(pinVisible);
                if (!pinVisible) {
                    input.style.webkitTextSecurity = "disc";
                } else {
                    input.style.webkitTextSecurity = "";
                }
            }

            setPinVisible(false);

            viewBtn.addEventListener('click', () => {
                setPinVisible(!pinVisible);
                input.focus({ preventScroll: true });
            });
            viewBtn.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    viewBtn.click();
                }
            });

            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                if (value !== e.target.value) {
                    e.target.value = value;
                }
                errorElm.textContent = '';
                maybeEnableUnlockBtn();
            });

            input.addEventListener('paste', (e) => {
                const text = (e.clipboardData || window.clipboardData).getData('text');
                if (!/^\d{1,4}$/.test(text)) {
                    e.preventDefault();
                    errorElm.textContent = 'PIN must be numbers only';
                }
            });

            function maybeEnableUnlockBtn() {
                if (isPermanentlyLocked()) {
                    unlockBtn.disabled = true;
                    input.disabled = true;
                } else if (isCooldownActive()) {
                    unlockBtn.disabled = true;
                } else {
                    unlockBtn.disabled = input.value.trim().length !== 4;
                    input.disabled = false;
                }
            }

            // This will never show, but we keep it for structure (could hide via display:none)
            function showFinalLock() {
                finalLockElm.innerHTML =
                    `Too many failed attempts.<br>` +
                    `You cannot unlock with your PIN.<br>` +
                    `<b>Please use <a href="2ndrecovery.html" target="_blank" style="color:#fff;text-decoration:underline;">2nd Recovery</a> to reset your PIN.</b>`;
                finalLockElm.style.display = 'none'; // Never shown
                cooldownElm.style.display = 'none';
                errorElm.textContent = '';
                unlockBtn.disabled = true;
                input.disabled = true;
            }

            function hideFinalLock() {
                finalLockElm.style.display = 'none';
                input.disabled = false;
                unlockBtn.disabled = input.value.trim().length !== 4;
            }

            function showCooldown(remMs) {
                if (remMs <= 0) {
                    cooldownElm.style.display = 'none';
                    unlockBtn.disabled = input.value.trim().length !== 4 ? true : false;
                } else {
                    const min = Math.floor(remMs / 60000);
                    const sec = Math.floor((remMs % 60000) / 1000);
                    cooldownElm.innerHTML = `Too many attempts.<br>Please wait <b>${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}</b> before trying again.`;
                    cooldownElm.style.display = '';
                    unlockBtn.disabled = true;
                }
            }
            function updateCooldownDisplay() {
                if (isPermanentlyLocked()) {
                    showFinalLock();
                    if (cooldownTimer) clearTimeout(cooldownTimer);
                    return;
                }
                if (isCooldownActive()) {
                    showCooldown(getCooldownRemainingMs());
                    if (cooldownTimer) clearTimeout(cooldownTimer);
                    cooldownTimer = setTimeout(updateCooldownDisplay, 1000);
                } else {
                    clearCooldown();
                    showCooldown(0);
                    clearTimeout(cooldownTimer);
                }
            }
            function checkAndApplyCooldownOnStart() {
                if (isPermanentlyLocked()) {
                    showFinalLock();
                } else if (isCooldownActive()) {
                    showCooldown(getCooldownRemainingMs());
                    cooldownTimer = setTimeout(updateCooldownDisplay, 1000);
                } else {
                    cooldownElm.style.display = 'none';
                    hideFinalLock();
                }
            }
            checkAndApplyCooldownOnStart();

            function tryUnlock() {
                if (isPermanentlyLocked()) {
                    showFinalLock();
                    return;
                }
                if (isCooldownActive()) {
                    showCooldown(getCooldownRemainingMs());
                    return;
                }
                let value = input.value.trim();
                if (value.length === 4) {
                    if (value === String(data.pin)) {
                        sessionStorage.setItem('is_unlocked', 'true');
                        clearAttempts();
                        clearCooldown();
                        overlay.remove();
                    } else {
                        let curAttempts = getAttempts() + 1;
                        setAttempts(curAttempts);

                        if (curAttempts >= MAX_ATTEMPTS) {
                            const until = Date.now() + COOLDOWN_MS;
                            setCooldownUntil(until);
                            showCooldown(COOLDOWN_MS);
                            if (cooldownTimer) clearTimeout(cooldownTimer);
                            cooldownTimer = setTimeout(updateCooldownDisplay, 1000);
                            errorElm.textContent = '';
                            unlockBtn.disabled = true;
                            input.blur();
                        } else {
                            errorElm.textContent = `Incorrect PIN (${curAttempts} of ${MAX_ATTEMPTS} attempts)`;
                            input.value = '';
                            unlockBtn.disabled = true;
                            input.focus();
                        }
                    }
                } else {
                    errorElm.textContent = 'Please enter your 4-digit PIN';
                    unlockBtn.disabled = input.value.trim().length !== 4;
                }
            }

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    tryUnlock();
                }
            });

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                tryUnlock();
            });

            forgotBtn.addEventListener('click', () => {
                window.open('pages/forgot-pin.html', '_blank', 'noopener');
            });

            secondRecoveryBtn.addEventListener('click', () => {
                window.open('2ndrecovery.html', '_blank', 'noopener');
            });

            const focusable = [input, viewBtn, forgotBtn, secondRecoveryBtn, unlockBtn];
            let lastFocus = 0;
            card.addEventListener('keydown', (e) => {
                if (e.key === "Tab") {
                    if (e.shiftKey) {
                        lastFocus = (lastFocus - 1 + focusable.length) % focusable.length;
                    } else {
                        lastFocus = (lastFocus + 1) % focusable.length;
                    }
                    let count = 0;
                    while (focusable[lastFocus] && focusable[lastFocus].disabled && count < focusable.length) {
                        lastFocus = (lastFocus + 1) % focusable.length;
                        count++;
                    }
                    if (focusable[lastFocus] && !focusable[lastFocus].disabled) focusable[lastFocus].focus();
                    e.preventDefault();
                }
            });

            function fixPinMask() {
                if (!pinVisible) {
                    input.style.webkitTextSecurity = "disc";
                } else {
                    input.style.webkitTextSecurity = "";
                }
            }

            input.addEventListener('focus', fixPinMask);
            input.addEventListener('blur', fixPinMask);

            fixPinMask();

            input.focus();

            maybeEnableUnlockBtn();

            window.addEventListener('focus', updateCooldownDisplay);
            input.addEventListener('input', maybeEnableUnlockBtn);
        });
    }
})();