import { connect, disconnect } from '../database';
import { mockMovies, mockGenres } from './mockData';
import Movie from '../models/movie';
import Genre from '../models/genre';

beforeAll(async () => {
  await connect();
  await Movie.deleteMany({});
  await Genre.deleteMany({});
});

beforeEach(async () => {
  await Genre.insertMany(mockGenres);
  await Movie.insertMany(mockMovies);
});
  
afterEach(async () => {
  await Movie.deleteMany({});
  await Genre.deleteMany({});
});

afterAll(async () => {
  await Movie.deleteMany({});
  await Genre.deleteMany({});
  await Genre.insertMany(mockGenres);
  await Movie.insertMany(mockMovies);
  await disconnect();
});
