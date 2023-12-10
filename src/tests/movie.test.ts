import request from 'supertest';
import app from '../app';
import Movie from '../models/movie';
import Genre from '../models/genre';
import { mockMovies } from './mockData';

// Test for GET all movies
describe('GET /api/movies', () => {
  it('should return a list of movies', async () => {
    Movie.find = jest.fn().mockResolvedValue(mockMovies);
    const res = await request(app).get('/api/movies');
    expect(Movie.find).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(mockMovies.length);
  });
});

// Test for GET a single movie by ID
describe('GET /api/movies/:id', () => {
  it('should return a single movie by ID', async () => {
    const mockMovie = { ...mockMovies[0], _id: 'aaaa12345678901234567890' };
    Movie.findById = jest.fn().mockResolvedValue(mockMovie);
    const res = await request(app).get(`/api/movies/${mockMovie._id}`);
    expect(Movie.findById).toHaveBeenCalledWith(mockMovie._id);
    expect(res.statusCode).toEqual(200);
    expect({
      ...res.body,
      releaseDate: new Date(res.body.releaseDate),
    }).toEqual(mockMovie);
  });
});

// Test for 404 error if movie is not found
describe('GET /api/movies/:id', () => {
  it('should return 404 if movie is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    Movie.findById = jest.fn().mockResolvedValue(null);
    const res = await request(app).get(`/api/movies/${nonExistentId}`);
    expect(Movie.findById).toHaveBeenCalledWith(nonExistentId);
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
      genre: ['Action'],
    };
    Genre.find = jest.fn().mockResolvedValue([{ name: 'Action' }]);
    Movie.prototype.save = jest.fn().mockResolvedValue(newMovie);
    const res = await request(app).post('/api/movies').send(newMovie);
    expect(res.statusCode).toEqual(201);
    expect({
      ...res.body,
      releaseDate: new Date(res.body.releaseDate),
    }).toEqual(newMovie);
  });
});

// Test for POST (Create a new movie with invalid genres format)
describe('POST /api/movies', () => {
  it('should return 400 if genres is not an array', async () => {
    const newMovie = {
      title: 'Test Movie',
      description: 'This is a test',
      releaseDate: new Date(),
      genre: 'Action',
    };
    Genre.find = jest.fn().mockResolvedValue([{ name: 'Action' }]);
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
      genre: ['Action', 'InvalidGenre'],
    };
    Genre.find = jest.fn().mockResolvedValue([{ name: 'Action' }]);
    const res = await request(app).post('/api/movies').send(newMovie);
    expect(res.statusCode).toEqual(400);
  });
});

// Test for PUT (Update an existing movie)
describe('PUT /api/movies/:id', () => {
  it('should update an existing movie', async () => {
    const fakeId = 'aaaa12345678901234567890';
    const updatedData = { title: 'Updated Title' };
    const movieToUpdate = { _id: fakeId, ...mockMovies[0] };
    Movie.findByIdAndUpdate = jest.fn().mockResolvedValue(movieToUpdate);
    const res = await request(app)
      .put(`/api/movies/${fakeId}`)
      .send(updatedData);
    expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith(fakeId, updatedData, {
      new: true,
    });
    expect(res.statusCode).toEqual(200);
    expect({
      ...res.body,
      releaseDate: new Date(res.body.releaseDate),
    }).toEqual(movieToUpdate);
  });
});

// Test for PUT (Try to update a non-existent movie)
describe('PUT /api/movies/:id', () => {
  it('should return 404 if movie is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    const updatedData = { title: 'Updated Title' };
    Movie.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    const res = await request(app)
      .put(`/api/movies/${nonExistentId}`)
      .send(updatedData);
    expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith(
      nonExistentId,
      updatedData,
      { new: true }
    );
    expect(res.statusCode).toEqual(404);
  });
});

// Test for PUT (Update an existing movie with invalid genres format)
describe('PUT /api/movies/:id', () => {
  it('should return 400 if genres is not an array when updating', async () => {
    const fakeId = 'aaaa12345678901234567890';
    const updatedData = { genre: 'Action' };
    Movie.findOne = jest.fn().mockResolvedValue({ _id: fakeId });
    const res = await request(app)
      .put(`/api/movies/${fakeId}`)
      .send(updatedData);
    expect(res.statusCode).toEqual(400);
  });
});

// Test for PUT (Update an existing movie with invalid genres)
describe('PUT /api/movies/:id', () => {
  it('should return 400 if one or more genres are invalid when updating', async () => {
    const fakeId = 'aaaa12345678901234567890';
    const updatedData = { genre: ['Action', 'InvalidGenre'] };
    Genre.find = jest.fn().mockResolvedValue([{ name: 'Action' }]);
    Movie.findOne = jest.fn().mockResolvedValue({ _id: fakeId });
    const res = await request(app)
      .put(`/api/movies/${fakeId}`)
      .send(updatedData);
    expect(res.statusCode).toEqual(400);
  });
});

// Test for DELETE (Delete an existing movie)
describe('DELETE /api/movies/:id', () => {
  it('should delete an existing movie', async () => {
    const fakeId = 'aaaa12345678901234567890';
    Movie.findByIdAndRemove = jest.fn().mockResolvedValue({ _id: fakeId });
    const res = await request(app).delete(`/api/movies/${fakeId}`);
    expect(Movie.findByIdAndRemove).toHaveBeenCalledWith(fakeId);
    expect(res.statusCode).toEqual(204);
  });
});

// Test for DELETE (Try to delete a non-existent movie)
describe('DELETE /api/movies/:id', () => {
  it('should return 404 if movie is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    Movie.findByIdAndRemove = jest.fn().mockResolvedValue(null);
    const res = await request(app).delete(`/api/movies/${nonExistentId}`);
    expect(Movie.findByIdAndRemove).toHaveBeenCalledWith(nonExistentId);
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
      genre: ['Action'],
    };
    Genre.find = jest.fn().mockResolvedValue([{ name: 'Action' }]);
    const res = await request(app).post('/api/movies').send(newMovie);
    expect(res.statusCode).toEqual(400);
  });
});

// Test for GET movies by genre
describe('GET /api/movies/genre/:genreName', () => {
  // Test with existing genres
  it('should return movies of a specific genre (e.g., Action)', async () => {
    Movie.find = jest.fn().mockResolvedValue([
      { title: 'Action Movie 1', genre: ['Action', 'Adventure'] },
      { title: 'Action Movie 2', genre: ['Action', 'Thriller'] },
    ]);
    const res = await request(app).get('/api/movies/genre/Action');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  // Test with non-existing genre
  it('should return 404 for a non-existing genre', async () => {
    // Мокирование Movie.find для имитации отсутствия фильмов с данным жанром
    Movie.find = jest.fn().mockResolvedValue([]);
    const res = await request(app).get('/api/movies/genre/NonExistentGenre');
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual('No movies found for this genre');
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
    Movie.find = jest.fn().mockRejectedValue(new Error('Database error'));
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toEqual(500);
  });
});
