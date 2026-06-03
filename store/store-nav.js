const navbar = document.createElement('nav');
navbar.className = 'simple-navbar';
navbar.innerHTML = `
  <a href="store.html" class="logo" aria-label="App Store Home">
    <img src="assets/favicon.png" alt="" style="border-radius:100%;width:32px;vertical-align:middle;filter:brightness(90%);">
    <span style="font-weight:700;color:#fff;font-size:1.18em;margin-left:8px;vertical-align:middle;">STADIA</span>
  </a>
  <button class="navbar-hamburger" aria-label="Toggle Navigation" aria-expanded="false" tabindex="0">
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
  <ul class="navbar-links">
  <li><a href="store.html">Browse</a></li>
    <li><a href="../index.html">Website</a></li>
    <li><a href="about.html">About</a></li>
  </ul>
`;

navbar.style.cssText = `
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  background: #111;
  box-shadow: 0 1px 12px rgba(10,10,20,0.17);
  padding: 0.6em 2em;
  min-height: 54px;
  z-index: 100;
  position: sticky;
  top: 0;
`;

const style = document.createElement('style');
style.textContent = `
.simple-navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background: #111 !important;
}
.simple-navbar .logo {
  display: flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
}
.simple-navbar .navbar-links {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: max-height 0.3s cubic-bezier(.77,0,.18,1), opacity 0.3s;
  background: transparent;
}
.simple-navbar .navbar-links li a {
  text-decoration: none;
  color: #f5f5f7;
  font-weight: 500;
  font-size: 1.05em;
  padding: 3px 0;
  transition: color 0.2s;
  display: inline-block;
}
.simple-navbar .navbar-links li a:hover,
.simple-navbar .navbar-links li a:focus {
  color: #b1b5bd;
}
.simple-navbar .navbar-hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5em;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 38px;
  width: 44px;
  margin-left: 18px;
  margin-right: -10px;
  z-index: 102;
}
.simple-navbar .navbar-hamburger:focus-visible {
  outline: 2px solid #fff;
}
.simple-navbar .navbar-hamburger .bar {
  display: block;
  width: 26px;
  height: 3px;
  margin: 4px 0;
  background: #fff;
  border-radius: 2px;
  transition: all 0.32s cubic-bezier(.77,0,.18,1);
}
.simple-navbar.active .navbar-hamburger .bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.simple-navbar.active .navbar-hamburger .bar:nth-child(2) {
  opacity: 0;
}
.simple-navbar.active .navbar-hamburger .bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}
.store-footer {
  width: 100%;
  background: #e3eefb;
  border-top: 1.5px solid #d2e0ef;
  color: #6e8898;
  padding: 2.2em 0 1.1em 0;
  text-align: center;
  font-size: 1.02em;
  letter-spacing: 0.01em;
  font-weight: 500;
  margin-top: 3.5em;
  z-index: 10;
}
.store-footer a {
  color: #318EB8;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
  transition: color 0.18s;
}
.store-footer a:hover {
  color: #4CA1C4;
}
@media (max-width: 720px) {
  .simple-navbar {
    padding: 0.4em 1.4em;
  }
  .simple-navbar .navbar-links {
    flex-direction: column;
    position: absolute;
    top: 54px;
    left: 0;
    right: 0;
    background: #111;
    gap: 0;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    border-bottom: 1px solid #232323;
    box-shadow: 0 4px 18px rgba(60,60,60,0.07);
  }
  .simple-navbar.active .navbar-links {
    max-height: 220px;
    opacity: 1;
    transition: max-height 0.32s cubic-bezier(.77,0,.18,1), opacity 0.32s;
  }
  .simple-navbar .navbar-links li {
    border-bottom: 1px solid #181818;
    padding: 0;
    margin: 0;
  }
  .simple-navbar .navbar-links li:last-child {
    border-bottom: none;
  }
  .simple-navbar .navbar-links li a {
    padding: 13px 24px 13px 16vw;
    width: 100%;
    display: block;
    font-size: 1.09em;
    color: #f5f5f7;
  }
  .simple-navbar .navbar-hamburger {
    display: flex;
  }
  .store-footer {
    font-size: 0.97em;
    padding: 1.6em 0 0.8em 0;
    margin-top: 2.4em;
  }
}
`;

document.head.appendChild(style);

navbar.querySelector('.logo').style.cssText = `
  display: flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
`;

const ul = navbar.querySelector('ul');
const hamburger = navbar.querySelector('.navbar-hamburger');

const footer = document.createElement('footer');
footer.className = 'store-footer';
footer.innerHTML = `
  &copy; ${new Date().getFullYear()} Stadia Studios &mdash; Powered by <a href="https://stadiastudios.github.io/stadia/" target="_blank" rel="noopener">Stadia Studios</a>
`;

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  body.insertBefore(navbar, body.firstChild);
  body.appendChild(footer);

  let expanded = false;

  hamburger.addEventListener('click', () => {
    expanded = !expanded;
    hamburger.setAttribute('aria-expanded', expanded);
    navbar.classList.toggle('active', expanded);
    if (expanded) {
      ul.querySelector('a').focus();
    }
  });

  document.addEventListener('click', e => {
    if (expanded && !navbar.contains(e.target)) {
      expanded = false;
      hamburger.setAttribute('aria-expanded', 'false');
      navbar.classList.remove('active');
    }
  });

  hamburger.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      hamburger.click();
      e.preventDefault();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 730) {
      navbar.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      expanded = false;
    }
  });
});

[...ul.querySelectorAll('a')].forEach(a => {
  a.style.cssText = `
    text-decoration: none;
    color: #f5f5f7;
    font-weight: 500;
    font-size: 1.05em;
    padding: 3px 0;
    transition: color 0.18s;
    display: inline-block;
  `;
  a.onmouseenter = () => (a.style.color = "#b1b5bd");
  a.onmouseleave = () => (a.style.color = "#f5f5f7");
});