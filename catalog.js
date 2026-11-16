const categoryList = document.querySelector('#categories');
const products = document.querySelector('#products');
const search = document.querySelector('#search');
const results = document.querySelector('#results');
const catalogSearch = document.querySelector('#catalog-search');
const catalogSearchResults = document.querySelector('#catalog-search-results');

let selected = categories[0];

function renderResults(models, query, results) {
  const matches = models.filter(model => model.name.toLocaleLowerCase('ru').includes(query));
  results.replaceChildren();

  if (!matches.length) {
    results.textContent = 'По запросу ничего не найдено.';
    return;
  }

  for (const model of matches) {
    const card = document.createElement('article');
    card.className = 'product';
    const title = document.createElement('h3');
    const detail = document.createElement('a');
    detail.href = 'product.html?id=' + encodeURIComponent(model.id);
    detail.textContent = model.name;
    title.append(detail);
    const contact = document.createElement('a');
    contact.href = 'tel:+79280000391';
    contact.textContent = 'Уточнить цену и наличие';
    const action = document.createElement('p');
    action.append(contact);
    card.append(title, action);
    results.append(card);
  }
}

for (const category of categories) {
  const hasCategoryPage = ['iphone', 'macbook', 'ipad', 'airpods'].includes(category.id);
  const button = document.createElement(hasCategoryPage ? 'a' : 'button');
  button.className = 'category';
  button.dataset.category = category.id;


  const photo = document.createElement('img');
  photo.src = 'assets/' + (category.cardImage ?? category.image ?? category.id + '.jpg');
  photo.alt = '';
  photo.width = 218;
  photo.height = 205;
  photo.loading = 'lazy';
  const label = document.createElement('span');
  label.textContent = category.name;
  const visual = document.createElement('div');
  visual.className = 'category-visual';
  visual.append(photo);
  button.append(visual, label);

  categoryList.append(button);
  if (hasCategoryPage) {
    button.href = category.id + '/';
    continue;
  }

  button.type = 'button';
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    categoryList.querySelectorAll('button').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    selected = category;
    search.value = '';
    products.hidden = false;
    renderResults(catalogProducts.filter(product => product.category === selected), '', results);
  });
}

search.addEventListener('input', () => {
  renderResults(catalogProducts.filter(product => product.category === selected), search.value.trim().toLocaleLowerCase('ru'), results);
});

catalogSearch.addEventListener('input', () => {
  const query = catalogSearch.value.trim().toLocaleLowerCase('ru');
  if (query) {
    renderResults(catalogProducts, query, catalogSearchResults);
  } else {
    catalogSearchResults.replaceChildren();
  }
});

for (const link of document.querySelectorAll('.hero a[data-category]')) {
  link.addEventListener('click', () => {
    categoryList.querySelector('button[data-category="' + link.dataset.category + '"]')?.click();
  });
}

