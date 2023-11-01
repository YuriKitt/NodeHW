import request from 'supertest';
import app from '../app';
import { mockMovies } from './mockData';
import Movie from '../models/movie';
import { connect, disconnect } from '../database';

// Test for GET all movies
describe('GET /api/movies', () => {
  it('should return a list of movies', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(mockMovies.length);
  });
});

// Test for GET a single movie by ID
describe('GET /api/movies/:id', () => {
  it('should return a single movie by ID', async () => {
    const movie = await Movie.findOne();
    if (movie) {
      const res = await request(app).get(`/api/movies/${movie._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual(movie.title);
    }
  });
});

// Test for 404 error if movie is not found
describe('GET /api/movies/:id', () => {
  it('should return 404 if movie is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    const res = await request(app).get(`/api/movies/${nonExistentId}`);
    expect(res.body.error).toEqual("Movie not found");
    expect(res.statusCode).toEqual(404);
  });
});

// Test for POST (Create a new movie)
describe('POST /api/movies', () => {
  it('should create a new movie', async () => {
    const newMovie = {
      title: 'Test Movie',
      description: 'This is a test',
      releaseDate: new Date(),
      genre: ['Action']
    };
    const res = await request(app).post('/api/movies').send(newMovie);
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual(newMovie.title);
    expect(res.body.description).toEqual(newMovie.description);
    expect(new Date(res.body.releaseDate)).toEqual(newMovie.releaseDate);
    expect(res.body.genre).toEqual(expect.arrayContaining(newMovie.genre));
  });
});

// Test for POST (Create a new movie with invalid genres format)
describe('POST /api/movies', () => {
  it('should return 400 if genres is not an array', async () => {
    const newMovie = {
      title: 'Test Movie',
      description: 'This is a test',
      releaseDate: new Date(),
      genre: 'Action'
    };
    const res = await request(app).post('/api/movies').send(newMovie);
    expect(res.statusCode).toEqual(400);
  });
});

// Test for POST (Create a new movie with invalid genres)
describe('POST /api/movies', () => {
  it('should return 400 if one or more genres are invalid', async () => {
    const newMovie = {
      title: 'Test Movie',
      description: 'This is a test',
      releaseDate: new Date(),
      genre: ['Action', 'InvalidGenre']
    };
    const res = await request(app).post('/api/movies').send(newMovie);
    expect(res.statusCode).toEqual(400);
  });
});

// Test for PUT (Update an existing movie)
describe('PUT /api/movies/:id', () => {
  it('should update an existing movie', async () => {
    const movie = await Movie.findOne();
    if (movie) {
      const updatedData = {
        title: 'Updated Title'
      };
      const res = await request(app).put(`/api/movies/${movie._id}`).send(updatedData);
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual('Updated Title');
    }
  });
});

// Test for PUT (Try to update a non-existent movie)
describe('PUT /api/movies/:id', () => {
  it('should return 404 if movie is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    const updatedData = {
      title: 'Updated Title'
    };
    const res = await request(app).put(`/api/movies/${nonExistentId}`).send(updatedData);
    expect(res.statusCode).toEqual(404);
  });
});

// Test for PUT (Update an existing movie with invalid genres format)
describe('PUT /api/movies/:id', () => {
  it('should return 400 if genres is not an array when updating', async () => {
    const movie = await Movie.findOne();
    if (movie) {
      const updatedData = {
        genre: 'Action'
      };
      const res = await request(app).put(`/api/movies/${movie._id}`).send(updatedData);
      expect(res.statusCode).toEqual(400);
    }
  });
});

// Test for PUT (Update an existing movie with invalid genres)
describe('PUT /api/movies/:id', () => {
  it('should return 400 if one or more genres are invalid when updating', async () => {
    const movie = await Movie.findOne();
    if (movie) {
      const updatedData = {
        genre: ['Action', 'InvalidGenre']
      };
      const res = await request(app).put(`/api/movies/${movie._id}`).send(updatedData);
      expect(res.statusCode).toEqual(400);
    }
  });
});

// Test for DELETE (Delete an existing movie)
describe('DELETE /api/movies/:id', () => {
  it('should delete an existing movie', async () => {
    const movie = await Movie.findOne();
    if (movie) {
      const res = await request(app).delete(`/api/movies/${movie._id}`);
      expect(res.statusCode).toEqual(204);
    }
  });
});

// Test for DELETE (Try to delete a non-existent movie)
describe('DELETE /api/movies/:id', () => {
  it('should return 404 if movie is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    const res = await request(app).delete(`/api/movies/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
  });
});

// Test for error handling and validation
describe('Error handling and validation', () => {
  it('should not create a new movie with invalid data', async () => {
    const newMovie = {
      title: '', 
      description: 'This is a test',
      releaseDate: new Date(),
      genre: ['Action']
    };
    const res = await request(app).post('/api/movies').send(newMovie);
    expect(res.statusCode).toEqual(400);
  });
});

// Test for GET movies by genre
describe('GET /api/movies/genre/:genreName', () => {
  // Test with existing genres
  it('should return movies of a specific genre (e.g., Action)', async () => {
    const res = await request(app).get('/api/movies/genre/Action');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((movie: any) => {
      expect(movie.genre).toEqual(expect.arrayContaining(['Action']));
    });
  });

  // Test with non-existing genre
  it('should return 404 for a non-existing genre', async () => {
    const res = await request(app).get('/api/movies/genre/NonExistentGenre');
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("No movies found for this genre");
  });

  // Test with invalid genre parameter (e.g., empty string or less than 3 characters)
  it('should return 400 for an invalid genre', async () => {
    const res = await request(app).get('/api/movies/genre/Ab');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
  });
});

// Test for error 500
describe('GET /api/movies', () => {
  it('should return 500 if database operation fails', async () => {
    await disconnect();
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toEqual(500);
    await connect();
  });
});