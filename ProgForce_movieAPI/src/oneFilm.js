import oneFilmMarkup from './markup/oneFilm.hbs';
import moviesApi from './utils/api';
import refs from './refs';
import filmsData from './data/films';
import localStorage from './utils/localStorage';
import renderFavorites from './favorites';
import renderFilmList from './movieList';

export default {
  element: '',

  async createMarkup(id) {
    const oneFilmResponse = await moviesApi.loadOneFilm(id);

    const filmInFavorits = filmsData.favorites.find(
      ({ id }) => id === oneFilmResponse.id,
    );

    if (filmInFavorits) {
      oneFilmResponse.inFavorite = true;
    }

    const markup = oneFilmMarkup(oneFilmResponse);

    return markup;
  },

  async render(el, id) {
    const markup = await this.createMarkup(id);
    el.innerHTML = '';
    el.insertAdjacentHTML('beforeend', markup);
  },

  async renderChoosenFilm(e) {
    if (e.target === e.currentTarget) return;
    const film = e.target.closest('li');

    if (film) {
      window.scrollTo(0, 0);

      refs.preloader.classList.remove('preloader--none');
      refs.body.classList.add('hideOverflow');

      this.element = film;

      await this.render(refs.oneFilmModal, film.id);

      refs.oneFilmModal.classList.remove('oneFilm--none');
      refs.preloader.classList.add('preloader--none');

      this.addEventListenersForOneFilm();
    }
  },

  addEventListenersForOneFilm() {
    const button = document.querySelector('.closeBtn');
    const favoriteBtn = document.querySelector('.oneFilm__checkbox--label');
    button.addEventListener('click', this.closeOnButton.bind(this));
    window.addEventListener('keydown', this.closeOnEsc.bind(this));
    favoriteBtn.addEventListener('click', this.toggleFavorite.bind(this));
  },

  close() {
    refs.oneFilmModal.classList.add('oneFilm--none');
    refs.body.classList.remove('hideOverflow');
    window.removeEventListener('keydown', this.closeOnEsc);

    // window.scrollTo(this.coords.x, this.coords.y);

    this.element.scrollIntoView({
      block: 'center',
    });
  },

  closeOnButton(e) {
    e.stopPropagation();
    this.close();
  },

  closeOnEsc(e) {
    if (e.code !== 'Escape') return;
    this.close();
  },

  toggleFavorite(e) {
    if (e.target.dataset.action === 'favorite') {
      e.stopPropagation();
    }

    if (e.target.tagName !== 'LABEL') return;

    if (e.target.control.checked) {
      this.deleteFromFavorite(e);
      return;
    }

    this.addToFavorite(e);
  },

  addToFavorite(e) {
    const film = e.target.closest('li') || e.target.closest('div');

    const filmToFavorite = filmsData.allFilms.find(
      ({ id }) => String(id) === film.id,
    );

    filmsData.favorites = [...filmsData.favorites, filmToFavorite];

    localStorage.save('favorites', filmsData.favorites);

    renderFavorites();
    renderFilmList();
  },

  deleteFromFavorite(e) {
    const film = e.target.closest('li') || e.target.closest('div');

    filmsData.favorites = filmsData.favorites.filter(
      ({ id }) => String(id) !== film.id,
    );

    localStorage.save('favorites', filmsData.favorites);

    renderFavorites();
    renderFilmList();
  },
};
