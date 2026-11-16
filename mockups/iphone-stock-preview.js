const view = new URLSearchParams(location.search).get('view');
document.body.dataset.view = view;
const groups = [...iphoneModels.children];

groups.forEach(group => {
  const title = group.querySelector('h2');
  const name = title.textContent;
  title.textContent = name;

  if (view === 'accordion') {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const count = group.querySelector('ul').children.length;
    summary.textContent = name + ' · ' + count + ' шт.';
    details.append(summary, ...[...group.children].slice(1));
    group.replaceChildren(details);
  }
});

if (view === 'accordion') groups[0].querySelector('details').open = true;

if (view === 'tabs') {
  const select = document.querySelector('#model');
  groups.forEach((group, index) => {
    select.add(new Option(group.querySelector('h2').textContent, index));
  });
  const showModel = () => groups.forEach((group, index) => {
    group.hidden = index !== select.selectedIndex;
  });
  select.addEventListener('change', showModel);
  document.querySelector('#model-picker').hidden = false;
  showModel();
}

