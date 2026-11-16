const macbookStock = {
  air: [
    ['13″ · M5 · 16 ГБ / 512 ГБ', [['Blue', 126500], ['Silver', 126500], ['Starlight', 126500], ['Midnight', 126500]]],
    ['15″ · M5 · 16 ГБ / 512 ГБ', [['Blue', 141000], ['Silver', 141000], ['Midnight', 141000], ['Starlight', 139000]]],
  ],
  neo: [
    ['13″ · 8 ГБ / 256 ГБ', [['Blush', 69000]]],
    ['13″ · 8 ГБ / 512 ГБ', [['Blush', 79000], ['Silver', 79000], ['Indigo', 79000]]],
  ],
  pro: [
    ['14″ · M5 · 16 ГБ / 512 ГБ', [['Space Black', null]]],
  ],
};

const buttons = document.querySelectorAll('.macbook-configurator .series-model-picker button');
const photo = document.querySelector('.macbook-photo img');
const colors = document.querySelector('#macbook-colors');
const sizes = document.querySelector('#macbook-sizes');
const configs = document.querySelector('#macbook-configs');
const finish = document.querySelector('#macbook-finish');
const total = document.querySelector('#macbook-total');
const rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const swatches = {
  Blue: '#b9ccd8', Silver: '#d9d9db', Starlight: '#e6dac6', Midnight: '#29313d',
  Blush: '#e9bfc4', Indigo: '#414962', 'Space Black': '#363639',
};

function addOption(group, selected, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-pressed', String(selected));
  button.addEventListener('click', onClick);
  group.append(button);
  return button;
}

function imagePath(model, specs, color) {
  const size = parseInt(specs, 10);
  return 'assets/macbook-' + model + '-' + size + '-' + color.toLowerCase().replaceAll(' ', '-') + '.webp';
}

function selectModel(modelButton) {
  const model = modelButton.dataset.model;
  const groups = macbookStock[model];
  let config = 0;
  const modelColors = [...new Set(groups.flatMap(([, variants]) => variants.map(([name]) => name)))];
  let color = modelColors[0];

  function render(focusGroup) {
    const [specs, variants] = groups[config];
    const sizeLabel = specs.split(' · ')[0];
    const availableSizes = [...new Set(groups.map(([label]) => label.split(' · ')[0]))];
    sizes.hidden = availableSizes.length < 2;
    for (const group of [colors, sizes, configs]) group.querySelectorAll('button').forEach(button => button.remove());

    if (!sizes.hidden) {
      for (const size of availableSizes) {
        const button = addOption(sizes, size === sizeLabel, () => {
          config = groups.findIndex(([label]) => label.split(' · ')[0] === size);
          render(sizes);
        });
        button.textContent = size;
      }
    }

    groups.forEach(([label], index) => {
      if (label.split(' · ')[0] !== sizeLabel) return;
      const button = addOption(configs, index === config, () => { config = index; render(configs); });
      button.textContent = label.split(' · ').at(-1);
    });
    for (const name of modelColors) {
      const button = addOption(colors, name === color, () => { color = name; render(colors); });
      button.setAttribute('aria-label', name);
      button.style.setProperty('--swatch', swatches[name]);
      if (['Midnight', 'Indigo', 'Space Black'].includes(name)) button.style.setProperty('--swatch-check', '#fff');
    }

    const variant = variants.find(([name]) => name === color);
    const size = parseInt(specs, 10);
    const src = imagePath(model, specs, color);
    photo.src = src;
    photo.alt = modelButton.textContent + ' ' + size + '″ — ' + color;
    finish.textContent = color;
    const amount = document.createElement('strong');
    amount.textContent = !variant ? 'Нет в наличии' : variant[1] === null ? 'Под заказ' : rubles.format(variant[1]);
    const selection = document.createElement('span');
    selection.className = 'series-selection';
    const modelName = document.createElement('strong');
    modelName.textContent = modelButton.textContent;
    const configuration = document.createElement('span');
    configuration.className = 'series-configuration';
    configuration.textContent = specs.replace('″', '').replaceAll(' ГБ', 'gb').replace(' / ', '/') + ' · ' + color;
    selection.append(modelName, configuration);
    total.replaceChildren(selection, amount);
    focusGroup?.querySelector('[aria-pressed="true"]')?.focus();
  }

  for (const button of buttons) button.setAttribute('aria-pressed', String(button === modelButton));
  render();
}

for (const button of buttons) button.addEventListener('click', () => selectModel(button));
selectModel(buttons[0]);
