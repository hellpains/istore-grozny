const serviceDialogs = new Map(
  [...document.querySelectorAll('.service-dialog')].map(dialog => ['#' + dialog.id, dialog])
);

for (const link of document.querySelectorAll('a[aria-haspopup="dialog"]')) {
  const dialog = serviceDialogs.get(link.hash);
  if (!dialog) continue;
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.showModal();
    dialog.addEventListener('close', () => {
      if (!link.closest('[inert]')) link.focus();
    }, { once: true });
  });
}

function openLinkedService() {
  const dialog = serviceDialogs.get(location.hash);
  if (dialog && !dialog.open) dialog.showModal();
}
window.addEventListener('hashchange', openLinkedService);
openLinkedService();

const deliveryDialog = serviceDialogs.get('#delivery');
deliveryDialog.addEventListener('submit', event => {
  if (event.submitter?.value !== 'catalog') return;
  deliveryDialog.addEventListener('close', () => {
    requestAnimationFrame(() => { location.hash = 'catalog'; });
  }, { once: true });
});
