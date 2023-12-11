import { IMovie } from '../models/movie';
import { IGenre } from '../models/genre';

export const mockGenres: Partial<IGenre>[] = [
  { name: 'Action' },
  { name: 'Comedy' },
  { name: 'Drama' },
  { name: 'Fantasy' },
  { name: 'Horror' }
];

export const mockMovies: Partial<IMovie>[] = [
  {
    title: 'Inception',
    description: 'A dream within a dream',
    releaseDate: new Date('2010-07-16'),
    genre: ['Action', 'Drama']
  },
  {
    title: 'Shrek',
    description: 'An ogre and a donkey go on an adventure',
    releaseDate: new Date('2001-05-18'),
    genre: ['Comedy', 'Fantasy']
  },
  {
    title: 'The Dark Knight',
    description: 'A bat fights a clown',
    releaseDate: new Date('2008-07-18'),
    genre: ['Action', 'Drama']
  },
  {
    title: 'Parasite',
    description: 'Social inequality explored',
    releaseDate: new Date('2019-05-30'),
    genre: ['Drama', 'Comedy']
  },
  {
    title: 'The Exorcist',
    description: 'Scary movie about an exorcism',
    releaseDate: new Date('1973-12-26'),
    genre: ['Horror', 'Drama']
  }
];
