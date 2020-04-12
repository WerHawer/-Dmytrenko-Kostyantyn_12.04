import localStorage from './utils/localStorage';
import refs from './refs';

(() => {
  const pageViewLS = localStorage.load('pageView');

  if (pageViewLS === 'list') {
    refs.main.classList.add('list');
    refs.viewBlock.classList.remove('view-box--active');
    refs.viewList.classList.add('view-box--active');
  }
})();

const toggleView = e => {
  if (e.target.dataset.action === 'viewList') {
    refs.main.classList.add('list');
    refs.viewBlock.classList.remove('view-box--active');
    refs.viewList.classList.add('view-box--active');

    localStorage.save('pageView', 'list');
    return;
  }

  refs.main.classList.remove('list');
  refs.viewBlock.classList.add('view-box--active');
  refs.viewList.classList.remove('view-box--active');
  localStorage.save('pageView', 'block');
};

refs.viewContainer.addEventListener('click', toggleView);
