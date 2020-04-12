import moviesApi from './utils/api';
import filmListMarkup from './markup/filmList.hbs';
import refs from './refs';
import oneFilm from './oneFilm';
import filmsData from './data/films';
import localStorage from './utils/localStorage';
import selectOptionsMarkup from './markup/selectOptions.hbs';

refs.filmList.addEventListener(
  'click',
  oneFilm.renderChoosenFilm.bind(oneFilm),
);

const createSelectOptions = async () => {
  const loadedFilms = await moviesApi.loadFilms();
  const genres = loadedFilms
    .reduce((all, film) => [...all, ...film.genres], [])
    .map(genre => genre.toLowerCase())
    .reduce(
      (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
      [],
    );

  const markup = selectOptionsMarkup({ genres });
  refs.select.insertAdjacentHTML('beforeend', markup);
};

createSelectOptions();

const filter = films => {
  if (!refs.select.value) return films;
  return films.filter(film =>
    film.genres.map(genre => genre.toLowerCase()).includes(refs.select.value),
  );
};

const initFavoritesFromLS = films => {
  const favoritesLS = localStorage.load('favorites');

  if (favoritesLS) {
    filmsData.favorites = favoritesLS;
    films.map(film => {
      const coincidence = favoritesLS.find(filmLS => filmLS.id === film.id);

      if (coincidence) {
        film.inFavorite = true;
        return film;
      }

      film.inFavorite = false;
      return film;
    });
  }
};

const createFilmData = async () => {
  const loadedFilms = await moviesApi.loadFilms();
  const films = loadedFilms.map(film => ({ ...film, inFavorite: false }));

  initFavoritesFromLS(films);

  filmsData.allFilms = [...films];

  return filmsData;
};

const createMarkup = async () => {
  const data = await createFilmData();
  const allFilms = filter(data.allFilms);
  const markup = filmListMarkup({ allFilms });

  return markup;
};

const renderFilmList = async () => {
  const markup = await createMarkup();

  refs.filmList.innerHTML = '';
  refs.filmList.insertAdjacentHTML('beforeend', markup);
  refs.list = document.querySelector('.js-movie-list');

  refs.list.addEventListener('click', oneFilm.toggleFavorite.bind(oneFilm));
};

renderFilmList();

export default renderFilmList;

refs.select.addEventListener('change', renderFilmList);
