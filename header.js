const menuToggle = document.querySelector('.menu-toggle');
const siteNavigation = document.querySelector('#site-navigation');
const menuShade = document.querySelector('.menu-shade');
const mobileHeader = window.matchMedia('(max-width: 720px)');

function setMenuOpen(open, restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  siteNavigation.inert = mobileHeader.matches && !open;
  document.body.classList.toggle('mobile-menu-open', open);
  if (restoreFocus) menuToggle.focus();
}

menuToggle.hidden = false;
setMenuOpen(false);
menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') === 'false');
});
menuShade.addEventListener('click', () => setMenuOpen(false, true));
siteNavigation.addEventListener('click', event => {
  if (mobileHeader.matches && event.target.closest('a')) setMenuOpen(false, true);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false, true);
  }
});
mobileHeader.addEventListener('change', () => setMenuOpen(false));

const siteHeader = document.querySelector('.site-header');
function syncHeaderHeight() {
  document.documentElement.style.setProperty('--site-header-height', siteHeader.offsetHeight + 'px');
}

syncHeaderHeight();
new ResizeObserver(syncHeaderHeight).observe(siteHeader);

const scrollThumb = document.createElement('div');
scrollThumb.className = 'mobile-scroll-thumb';
scrollThumb.setAttribute('aria-hidden', 'true');
document.body.append(scrollThumb);
let scrollThumbTimer;

window.addEventListener('scroll', () => {
  const page = document.scrollingElement;
  const scrollRange = page.scrollHeight - page.clientHeight;
  if (!mobileHeader.matches || scrollRange <= 0) return;
  const start = siteHeader.offsetHeight + 4;
  const travel = Math.max(0, page.clientHeight - start - scrollThumb.offsetHeight - 4);
  const fraction = Math.min(1, Math.max(0, page.scrollTop / scrollRange));
  scrollThumb.style.transform = 'translateY(' + (start + fraction * travel) + 'px)';
  scrollThumb.classList.add('is-visible');
  clearTimeout(scrollThumbTimer);
  scrollThumbTimer = setTimeout(() => scrollThumb.classList.remove('is-visible'), 650);
}, { passive: true });
