if (document.body.dataset.view === 'series') {
  const tradeInDialog = document.createElement('dialog');
  tradeInDialog.className = 'series-price-dialog';
  tradeInDialog.setAttribute('aria-labelledby', 'trade-in-title');
  tradeInDialog.innerHTML = '<div class="series-dialog-heading"><h2 id="trade-in-title">Trade-in</h2><form method="dialog"><button aria-label="Закрыть">×</button></form></div><div class="series-trade-in-content"><ol class="trade-in-steps">         <li><h3>Оставьте заявку</h3><p>Позвоните по номеру <a href="tel:+79280000391">+7 (928) 000-03-91</a> или <a href="https://wa.me/79380000391">напишите в WhatsApp</a>.</p></li>         <li><h3>Оценим устройство</h3><p>Сотрудник проверит устройство и предварительно оценит его стоимость.</p></li>         <li><h3>Выберите новое устройство</h3><p>Вычтем итоговую стоимость старого устройства из цены нового.</p></li>       </ol></div>';

  const family = document.body.dataset.family || 'iPhone';
  const seriesStock = family === 'iPad' ? ipadStock : iphoneStock;
  const priceGroups = [...iphoneModels.children];
  const swatches = {
    Pink: '#e7a8bd', 'Space Black': '#38383b', Burgundy: '#541c27', Blue: '#a1bddc', Silver: '#f4f4f4', Black: '#383838',
    Orange: '#e67735', White: '#f9f9f9', Sage: '#b6c4ad', Lavender: '#cbc0e1',
    'Cloud Black': '#383838', 'Cloud White': '#f9f9f9',
    'Light Gold': '#ecdfbd', 'Sky Blue': '#dcecfb',
  };
  iphoneModels.replaceChildren();
  const picker = document.createElement('div');
  picker.className = 'series-model-picker';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Модель ' + family);
  iphoneModels.before(picker);
  for (const [name, sim, variants] of [...seriesStock].sort((a, b) =>
    Number(b[0].includes('18')) - Number(a[0].includes('18')) || a[0].localeCompare(b[0])
  )) {
    const row = document.createElement('li');
    const modelButton = document.createElement('button');
    const first = !picker.children.length;
    modelButton.type = 'button';
    modelButton.textContent = family === 'iPad' ? name.replace(' (M5)', '').replace('″', '') : name.slice(family.length + 1);
    modelButton.setAttribute('aria-pressed', String(first));
    row.hidden = !first;

    modelButton.addEventListener('click', () => {
      for (const button of picker.children) button.setAttribute('aria-pressed', String(button === modelButton));
      for (const panel of iphoneModels.children) panel.hidden = panel !== row;
    });
    picker.append(modelButton);

    const photo = document.createElement('img');
    photo.className = 'series-photo';
    photo.loading = 'lazy';
    let color = variants[0][1];
    let storage = variants[0][0];
    const colors = [...new Set(variants.map(variant => variant[1]))];
    const price = document.createElement('p');
    price.className = 'series-price';
    price.setAttribute('aria-live', 'polite');
    const selection = document.createElement('span');
    selection.className = 'series-selection';
    const modelLabel = document.createElement('strong');
    modelLabel.textContent = name;
    const configuration = document.createElement('span');
    configuration.className = 'series-configuration';
    selection.append(modelLabel, configuration);
    const total = document.createElement('strong');
    total.className = 'series-total';
    const checkout = document.createElement('span');
    checkout.className = 'series-checkout';
    const buy = document.createElement('a');
    buy.className = 'series-buy';

    checkout.append(total, buy);
    price.append(selection, checkout);
    const finishLabel = document.createElement('p');
    finishLabel.className = 'series-selected-finish';
    finishLabel.setAttribute('aria-live', 'polite');
    const colorPicker = createPicker('Цвет');
    colorPicker.classList.add('series-colors');
    const storageOptions = {
      'iPhone 18 Pro': ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
      'iPhone 18 Pro Max': ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
      'iPhone 17 Pro Max': ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
      'iPhone 17 Pro': ['256 ГБ', '512 ГБ', '1 ТБ'],
      'iPhone 17': ['256 ГБ', '512 ГБ'],
      'iPhone 17 Air': ['256 ГБ', '512 ГБ', '1 ТБ'],
    }[name] ?? [...new Set(variants.map(([capacity]) => capacity))];
    storage ||= storageOptions[0];
    const storagePicker = createPicker('Память');
    storagePicker.className = 'series-storage';

    function createPicker(label) {
      const picker = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = label;
      picker.append(legend);
      return picker;
    }

    function option(picker, value, selected, onSelect, amount) {
      const button = document.createElement('button');
      button.type = 'button';
      if (picker === colorPicker) {
        button.style.setProperty('--swatch', swatches[value]);
        if (['Burgundy', 'Black', 'Cloud Black', 'Space Black'].includes(value)) {
          button.style.setProperty('--swatch-check', '#fff');
        }
        button.setAttribute('aria-label', value);
        const label = document.createElement('span');
        label.className = 'series-color-label';
        label.textContent = value;
        button.append(label);
      } else {
        button.textContent = value;
        if (amount == null) {
          button.setAttribute('aria-label', value + ' — Нет в наличии');
        }
      }
      button.setAttribute('aria-pressed', String(selected));
      button.addEventListener('click', onSelect);
      picker.append(button);
    }

    function renderPhoto() {
      const finish = name.startsWith('iPhone 18 Pro') && color === 'Blue'
        ? 'glacier' : color.toLowerCase().replaceAll(' ', '-');
      const model = name.replace('″', '').replace(' (M5)', '').toLowerCase().replaceAll(' ', '-');
      photo.src = '../assets/' + model + '-' + finish + (family === 'iPad' ? '-cutout' : '') + '.webp';
      photo.alt = name + ' — ' + color;
    }

    function render() {
      for (const picker of [colorPicker, storagePicker]) {
        picker.querySelectorAll('button').forEach(button => button.remove());
      }
      renderPhoto();
      finishLabel.textContent = color;
      const available = variants.filter(variant => variant[1] === color);
      for (const value of colors) option(colorPicker, value, value === color, () => { color = value; render(); });
      for (const value of storageOptions) {
        const amount = available.find(([capacity]) => capacity === value)?.[2];
        option(storagePicker, value, value === storage, () => { storage = value; render(); }, amount);
      }
      const variant = available.find(item => item[0] === storage);
      const simLabel = variant?.[3] || sim;
      const details = [color, storage, simLabel === 'Физическая SIM' ? 'SIM' : simLabel].filter(Boolean);
      configuration.replaceChildren();
      details.forEach((detail, index) => {
        if (index) {
          const separator = document.createElement('span');
          separator.className = 'series-detail-dot';
          separator.textContent = ' · ';
          configuration.append(separator);
        }
        configuration.append(detail);
      });
      total.textContent = variant ? rubles.format(variant[2]) : 'Нет в наличии';
      total.classList.toggle('series-unavailable', !variant);
      buy.textContent = variant ? 'Купить' : 'Сообщить о поступлении';
      if (variant) {
        const message = 'Здравствуйте! Хочу купить ' + name + ' · ' + configuration.textContent + ' за ' + total.textContent;
        buy.href = 'https://wa.me/79380000391?text=' + encodeURIComponent(message);
      } else {
        buy.removeAttribute('href');
      }
      buy.setAttribute('aria-disabled', String(!variant));
    }

    render();
    const layout = document.createElement('div');
    layout.className = 'series-layout';
    const options = document.createElement('div');
    options.className = 'series-options';
    options.append(colorPicker, finishLabel);
    layout.append(photo);
    const warranty = document.createElement('p');
    warranty.className = 'series-warranty';
    warranty.textContent = 'Гарантия клиентам iStoreGrozny — 1 год';
    const panel = document.createElement('div');
    panel.className = 'series-glass-panel';
    const panelTop = document.createElement('div');
    panelTop.className = 'series-panel-top';
    const tradeIn = document.createElement('button');
    tradeIn.type = 'button';
    tradeIn.className = 'series-trade-in';
    tradeIn.setAttribute('aria-haspopup', 'dialog');
    tradeIn.addEventListener('click', () => tradeInDialog.showModal());
    tradeIn.textContent = 'Trade-in';
    panelTop.append(options, tradeIn);
    panel.append(panelTop, storagePicker, price, warranty);
    row.append(layout, panel);
    iphoneModels.append(row);
  }

  const openPrices = document.createElement('button');
  openPrices.type = 'button';
  openPrices.className = 'series-all-prices';
  openPrices.textContent = 'Все цены';

  const dialog = document.createElement('dialog');
  dialog.className = 'series-price-dialog';
  dialog.setAttribute('aria-labelledby', 'series-price-title');
  dialog.innerHTML = '<div class="series-dialog-heading"><h2 id="series-price-title">Цены на ' + family + '</h2><form method="dialog"><button aria-label="Закрыть">×</button></form></div><ul class="iphone-models"></ul>';
  dialog.querySelector('ul').append(...priceGroups);
  openPrices.addEventListener('click', () => dialog.showModal());
  iphoneModels.after(openPrices, dialog, tradeInDialog);
}
