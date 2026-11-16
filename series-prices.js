const iphoneModels = document.querySelector('#iphone-models');
const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0,
});

for (const [name, sim, variants] of seriesPriceStock) {
  const group = document.createElement('li');
  const title = document.createElement('h2');
  const product = catalogProducts.find(item => item.name === name);
  if (product) {
    const link = document.createElement('a');
    link.href = 'product.html?id=' + encodeURIComponent(product.id);
    link.textContent = name;
    title.append(link);
  } else {
    title.textContent = name;
  }
  group.append(title);

  if (sim) {
    const simLabel = document.createElement('p');
    simLabel.className = 'iphone-stock-sim';
    simLabel.textContent = sim;
    group.append(simLabel);
  }

  const list = document.createElement('ul');
  for (const [storage, color, price, variantSim] of variants) {
    const row = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = [storage, color, variantSim].filter(Boolean).join(' · ');
    const amount = document.createElement('strong');
    amount.textContent = rubles.format(price);
    row.append(label, amount);
    list.append(row);
  }
  group.append(list);
  iphoneModels.append(group);
}
