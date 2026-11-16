const categories = [
  { id: 'iphone', name: 'iPhone', image: 'iphone-category.png', models: ['iPhone 17 Pro', 'iPhone 17', 'iPhone 16'] },
  { id: 'macbook', name: 'MacBook', models: ['MacBook Air', 'MacBook Pro'] },
  { id: 'ipad', name: 'iPad', models: ['iPad Air', 'iPad mini'] },
  { id: 'airpods', name: 'AirPods', models: ['AirPods Pro', 'AirPods Max'] },
  { id: 'watch', name: 'Apple Watch', image: 'watch-ultra.png', models: ['Apple Watch Ultra 4', 'Apple Watch Series'] },
  { id: 'garmin', name: 'Garmin', models: ['Часы Garmin'], image: 'garmin.png' },
  { id: 'dyson', name: 'Dyson', models: ['Dyson Supersonic', 'Dyson Airwrap'] },
];

const catalogProducts = categories.flatMap(category => category.models.map(name => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  name,
  category,
  image: name === 'Apple Watch Ultra 4' ? 'watch-ultra-4.jpg' : category.image ?? category.id + '.jpg',
})));
