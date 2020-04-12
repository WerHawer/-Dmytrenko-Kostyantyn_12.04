import filmsData from './data/films';
import refs from './refs';
import favoritesMarcup from './markup/favorites.hbs';
import localStorage from './utils/localStorage';
import oneFilm from './oneFilm';

const deleteMovie = e => {
  if (e.target.dataset.action !== 'delete') return;
  oneFilm.deleteFromFavorite(e);
};

const renderFilm = e => {
  if (e.target.dataset.action === 'delete') return;
  oneFilm.renderChoosenFilm(e);
};

const toggleShowFavorites = () => {
  refs.favorites.classList.toggle('favorites--show');
  refs.favToggle.classList.toggle('favorites__toggle--show');
};

refs.favorites.addEventListener('click', renderFilm);
refs.favorites.addEventListener('click', deleteMovie);
refs.favToggle.addEventListener('click', toggleShowFavorites);

const renderFavorites = () => {
  const markup = favoritesMarcup(filmsData);
  refs.favorites.innerHTML = '';
  refs.favorites.insertAdjacentHTML('beforeend', markup);
};

(() => {
  const favoritesLS = localStorage.load('favorites');
  if (favoritesLS) {
    filmsData.favorites = favoritesLS;
  }
  renderFavorites();
})();

export default renderFavorites;
