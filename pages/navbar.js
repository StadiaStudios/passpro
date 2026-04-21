(function() {
    const style = document.createElement('style');
    style.textContent = `
        .glass-header {
            background: rgba(10, 10, 10, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        #mobileMenu {
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        #mobileMenu.hidden {
            display: none;
            opacity: 0;
            transform: translateY(-10px);
        }
    `;
    document.head.appendChild(style);

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const header = document.createElement('header');
    header.className = 'fixed top-0 left-0 right-0 z-[110] glass-header';
    header.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-8">
                <a href="../index.html" class="text-xl font-bold tracking-tighter text-white no-underline">PASSPRO</a>
                <nav class="hidden md:flex items-center gap-6">
                    <a href="../index.html" class="text-sm font-medium ${currentPage === 'index.html' ? 'text-white' : 'text-gray-400'} hover:text-white transition no-underline">Passwords</a>
                    <a href="generator.html" class="text-sm font-medium ${currentPage === 'generator.html' ? 'text-white' : 'text-gray-400'} hover:text-white transition no-underline">Password Generator</a>
                    <a href="card-vault.html" class="text-sm font-medium ${currentPage === 'card-vault.html' ? 'text-white' : 'text-gray-400'} hover:text-white transition no-underline">Wallet</a>
                    <a href="../themes.html" class="text-sm font-medium ${currentPage === 'themes.html' ? 'text-white' : 'text-gray-400'} hover:text-white transition no-underline">Themes</a>
                </nav>
            </div>
            
            <div class="flex items-center gap-4">
                <button id="navActionButton" class="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition">
                    + Action
                </button>
                <button id="mobileMenuBtn" class="md:hidden text-gray-400 hover:text-white p-2">
                    <i class="fas fa-bars text-lg"></i>
                </button>
            </div>
        </div>

        <div id="mobileMenu" class="hidden md:hidden absolute top-16 left-0 right-0 bg-[#0a0a0a] border-b border-white/5 p-6 space-y-4 shadow-2xl">
            <a href="index.html" class="block text-lg font-medium ${currentPage === 'index.html' ? 'text-white' : 'text-gray-400'} hover:text-white no-underline">Passwords</a>
            <a href="generator.html" class="block text-lg font-medium ${currentPage === 'generator.html' ? 'text-white' : 'text-gray-400'} hover:text-white no-underline">Password Generator</a>
            <a href="card-vault.html" class="block text-lg font-medium ${currentPage === 'card-vault.html' ? 'text-white' : 'text-gray-400'} hover:text-white no-underline">Wallet</a>
            <a href="themes.html" class="block text-lg font-medium ${currentPage === 'themes.html' ? 'text-white' : 'text-gray-400'} hover:text-white no-underline">Themes</a>
        </div>
    `;

    document.body.prepend(header);

    const menuBtn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const actionBtn = document.getElementById('navActionButton');

    if (currentPage === 'card-vault.html') {
        actionBtn.innerText = '+ Add Card';
        actionBtn.onclick = () => typeof openModal === 'function' && openModal();
    } 
    else {
        actionBtn.innerText = 'STADIASTUDIOS';
        actionBtn.onclick = () => typeof openModal === 'function' && openModal();
    }

    menuBtn.onclick = () => menu.classList.toggle('hidden');
})();