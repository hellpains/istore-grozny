if (window.ymaps) {
  ymaps.ready(() => {
    const mapElement = document.querySelector('#stores-map');
    const map = new ymaps.Map(mapElement, {
      center: [43.3266, 45.6848],
      zoom: 14,
      controls: [],
    });
    map.controls.add('zoomControl', { size: 'small' });
    map.behaviors.disable('scrollZoom');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let selection = 0;

    document.querySelectorAll('.address-map-link').forEach(link => {
      const coordinates = link.dataset.coordinates.split(',').map(Number);
      const phone = link.closest('.panel').querySelector('.address-phone');
      const marker = new ymaps.Placemark(coordinates, {
        balloonContentHeader: link.textContent,
        balloonContentBody: phone.outerHTML,
      }, { preset: 'islands#blackDotIcon', balloonAutoPan: false });
      map.geoObjects.add(marker);
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        mapElement.scrollIntoView({
          block: 'start',
          behavior: reducedMotion.matches ? 'instant' : 'smooth',
        });
        const current = ++selection;
        map.panTo(coordinates, { duration: reducedMotion.matches ? 0 : 350 }).then(() => {
          if (current === selection) marker.balloon.open();
        });
      });
    });
    map.setBounds(map.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin: 45 });
  });
}
