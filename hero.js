const slides = document.querySelectorAll('.hero-slide');
const pagination = document.querySelector('.hero-pagination');
const slideButtons = pagination.querySelectorAll('button');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeIndex = 0;
let progress;
let slideAnimations = [];

function selectSlide(index, direction = 1) {
  progress?.cancel();
  for (const animation of slideAnimations) animation.cancel();
  slideAnimations = [];

  const previousIndex = activeIndex;
  const sliding = previousIndex !== index && !reducedMotion.matches;
  activeIndex = index;
  slides.forEach((slide, position) => {
    slide.hidden = position !== index && !(sliding && position === previousIndex);
    slide.inert = position !== index;
    slideButtons[position].setAttribute('aria-pressed', String(position === index));
  });

  if (reducedMotion.matches) return;
  if (sliding) {
    const previous = slides[previousIndex];
    const timing = { duration: 460, easing: 'ease-in-out', fill: 'both' };
    const exit = previous.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${-direction * 100}%)` }],
      timing,
    );
    const entrance = slides[index].animate(
      [{ transform: `translateX(${direction * 100}%)` }, { transform: 'translateX(0)' }],
      timing,
    );
    slideAnimations = [exit, entrance];
    exit.onfinish = () => {
      if (slideAnimations[0] !== exit) return;
      previous.hidden = true;
      exit.cancel();
      entrance.cancel();
      slideAnimations = [];
    };
  }

  progress = slideButtons[index].querySelector('.hero-progress').animate(
    [{ clipPath: 'inset(0 100% 0 0 round 999px)' }, { clipPath: 'inset(0 0 0 0 round 999px)' }],
    { duration: 20000, fill: 'forwards' },
  );
  progress.onfinish = () => selectSlide((activeIndex + 1) % slides.length);
}

slideButtons.forEach((button, index) => {
  const fill = document.createElement('span');
  fill.className = 'hero-progress';
  fill.setAttribute('aria-hidden', 'true');
  button.append(fill);
  button.addEventListener('click', () => selectSlide(index));
});
reducedMotion.addEventListener('change', () => selectSlide(activeIndex));
pagination.hidden = false;
selectSlide(0);



const swipeArea = document.querySelector('.hero-slides');
let gesture;

swipeArea.addEventListener('touchstart', event => {
  if (event.touches.length !== 1 || slideAnimations.length) return;
  gesture = event.touches[0];
  progress?.pause();
}, { passive: true });

swipeArea.addEventListener('touchend', event => {
  if (!gesture) return;
  const start = gesture;
  gesture = undefined;
  const end = Array.from(event.changedTouches).find(touch => touch.identifier === start.identifier);
  const dx = end ? end.clientX - start.clientX : 0;
  const dy = end ? end.clientY - start.clientY : 0;
  if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy) * 1.25) {
    progress?.play();
    return;
  }

  if (event.cancelable) event.preventDefault();
  const direction = dx < 0 ? 1 : -1;
  selectSlide((activeIndex + direction + slides.length) % slides.length, direction);
}, { passive: false });

swipeArea.addEventListener('touchcancel', () => {
  if (!gesture) return;
  gesture = undefined;
  progress?.play();
}, { passive: true });
