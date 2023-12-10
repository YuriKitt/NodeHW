import request from 'supertest';
import app from '../app';
import Genre from '../models/genre';
import { mockGenres } from './mockData';

// Test for GET all genres
describe('GET /api/genres', () => {
  it('should return a list of genres', async () => {
    Genre.find = jest.fn().mockResolvedValue(mockGenres);
    const res = await request(app).get('/api/genres');
    expect(Genre.find).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(mockGenres.length);
    expect(res.body).toEqual(mockGenres);
  });
});

// Test for POST (Create a new genre)
describe('POST /api/genres', () => {
  it('should create a new genre', async () => {
    const newGenre = { name: 'Test Genre' };
    Genre.prototype.save = jest.fn().mockResolvedValue(newGenre);
    const res = await request(app).post('/api/genres').send(newGenre);
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual(newGenre.name);
  });
});

// Test for PUT (Update an existing genre)
describe('PUT /api/genres/:id', () => {
  it('should update an existing genre', async () => {
    const mockGenreId = 'aaaa12345678901234567890';
    const updatedData = { name: 'Updated Genre' };
    Genre.findByIdAndUpdate = jest
      .fn()
      .mockResolvedValue({ _id: mockGenreId, ...updatedData });
    const res = await request(app)
      .put(`/api/genres/${mockGenreId}`)
      .send(updatedData);
    expect(Genre.findByIdAndUpdate).toHaveBeenCalledWith(
      mockGenreId,
      updatedData,
      { new: true, runValidators: true }
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Updated Genre');
  });
});

// Test for PUT (Try to update a non-existent genre)
describe('PUT /api/genres/:id', () => {
  it('should return 404 if genre is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    const updatedData = { name: 'This Should Fail' };
    Genre.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    const res = await request(app)
      .put(`/api/genres/${nonExistentId}`)
      .send(updatedData);
    expect(res.statusCode).toEqual(404);
  });
});

// Test for DELETE (Delete an existing genre)
describe('DELETE /api/genres/:id', () => {
  it('should delete an existing genre', async () => {
    const genreId = 'aaaa12345678901234567890';
    const mockGenre = { _id: genreId, name: 'Mock Genre' };
    Genre.findByIdAndDelete = jest.fn().mockResolvedValue(mockGenre);
    const res = await request(app).delete(`/api/genres/${genreId}`);
    expect(Genre.findByIdAndDelete).toHaveBeenCalledWith(genreId);
    expect(res.statusCode).toEqual(204);
  });
});

// Test for DELETE (Try to delete a non-existent genre)
describe('DELETE /api/genres/:id', () => {
  it('should return 404 if genre is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    Genre.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    const res = await request(app).delete(`/api/genres/${nonExistentId}`);
    expect(Genre.findByIdAndDelete).toHaveBeenCalledWith(nonExistentId);
    expect(res.statusCode).toEqual(404);
  });
});

// Test for GET a single genre by ID
describe('GET /api/genres/:id', () => {
  it('should return a single genre by ID', async () => {
    const mockGenreId = 'aaaa12345678901234567890';
    const mockGenre = { _id: mockGenreId, name: 'Mock Genre' };
    Genre.findById = jest.fn().mockResolvedValue(mockGenre);
    const res = await request(app).get(`/api/genres/${mockGenreId}`);
    expect(Genre.findById).toHaveBeenCalledWith(mockGenreId);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(mockGenre.name);
  });
});

// Test for 404 error if genre is not found
describe('GET /api/genres/:id', () => {
  it('should return 404 if genre is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    Genre.findById = jest.fn().mockResolvedValue(null);
    const res = await request(app).get(`/api/genres/${nonExistentId}`);
    expect(Genre.findById).toHaveBeenCalledWith(nonExistentId);
    expect(res.body.error).toEqual('Genre not found');
    expect(res.statusCode).toEqual(404);
  });
});

// Test for error handling and validation
describe('Error handling and validation', () => {
  it('should not create a new genre with invalid data', async () => {
    const newGenre = { name: '' };
    const res = await request(app).post('/api/genres').send(newGenre);
    expect(res.statusCode).toEqual(400);
  });
});

// Test for error 500
describe('GET /api/genres', () => {
  it('should return 500 if database operation fails', async () => {
    Genre.find = jest.fn().mockRejectedValue(new Error('Database error'));
    const res = await request(app).get('/api/genres');
    expect(res.statusCode).toEqual(500);
  });
});
