import axios from 'axios';

export default {
  BASE_URL: 'http://my-json-server.typicode.com/moviedb-tech/movies/list',

  async loadFilms() {
    try {
      const filmsResponse = await axios.get(this.BASE_URL);
      return filmsResponse.data;
    } catch (error) {
      alert(error);
    }
  },

  async loadOneFilm(id) {
    try {
      const filmResponse = await axios.get(`${this.BASE_URL}/${id}`);
      return filmResponse.data;
    } catch (error) {
      alert(error);
    }
  },
};
