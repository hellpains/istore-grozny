const productId = new URLSearchParams(location.search).get('id');
const product = catalogProducts.find(item => item.id === productId);

if (product) {
  document.title = product.name + ' — iStoreGrozny';
  document.querySelector('#product-title').textContent = product.name;
  document.querySelector('#product-category').textContent = product.category.name;
  document.querySelector('#product-image').src = 'assets/' + product.image;
  document.querySelector('.product-detail').hidden = false;
} else {
  document.querySelector('#product-missing').hidden = false;
}
