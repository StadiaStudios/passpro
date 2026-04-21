document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;

    const toggleContainer = darkModeToggle.closest('.flex.items-center.justify-between');

    if (toggleContainer) {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'resetThemeBtn';
        resetBtn.className = 'ai-button mt-4 mb-2';
        resetBtn.innerHTML = 'RESET THEME TO DEFAULT';

        toggleContainer.parentNode.insertBefore(resetBtn, toggleContainer.nextSibling);

        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('__app_custom_theme_file');
            
            localStorage.setItem('__app_theme', 'dark');

            if (typeof showMessage === 'function') {
                showMessage('Theme reset to Default Dark Mode!', 'bg-green-600');
            }

            setTimeout(() => {
                window.location.reload();
            }, 800);
        });
    }
});