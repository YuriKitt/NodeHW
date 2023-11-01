import request from 'supertest';
import app from '../app';
import { mockGenres } from './mockData';
import Genre from '../models/genre';
import { connect, disconnect } from '../database';

// Test for GET all genres
describe('GET /api/genres', () => {
  it('should return a list of genres', async () => {
    const res = await request(app).get('/api/genres');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(mockGenres.length);
  });
});

// Test for POST (Create a new genre)
describe('POST /api/genres', () => {
  it('should create a new genre', async () => {
    const newGenre = { name: 'Test Genre' };
    const res = await request(app).post('/api/genres').send(newGenre);
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual(newGenre.name);
  });
});

// Test for PUT (Update an existing genre)
describe('PUT /api/genres/:id', () => {
  it('should update an existing genre', async () => {
    const genre = await Genre.findOne();
    if (genre) {
      const updatedData = { name: 'Updated Genre' };
      const res = await request(app).put(`/api/genres/${genre._id}`).send(updatedData);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual('Updated Genre');
    }
  });
});

// Test for PUT (Try to update a non-existent genre)
describe('PUT /api/genres/:id', () => {
  it('should return 404 if genre is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    const updatedData = { name: 'This Should Fail' };
    const res = await request(app).put(`/api/genres/${nonExistentId}`).send(updatedData);
    expect(res.statusCode).toEqual(404);
  });
});


// Test for DELETE (Delete an existing genre)
describe('DELETE /api/genres/:id', () => {
  it('should delete an existing genre', async () => {
    const genre = await Genre.findOne();
    if (genre) {
      const res = await request(app).delete(`/api/genres/${genre._id}`);
      expect(res.statusCode).toEqual(204);
    }
  });
});

// Test for DELETE (Try to delete a non-existent genre)
describe('DELETE /api/genres/:id', () => {
  it('should return 404 if genre is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    const res = await request(app).delete(`/api/genres/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
  });
});

// Test for GET a single genre by ID
describe('GET /api/genres/:id', () => {
  it('should return a single genre by ID', async () => {
    const genre = await Genre.findOne();
    if (genre) {
      const res = await request(app).get(`/api/genres/${genre._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(genre.name);
    }
  });
});

// Test for 404 error if genre is not found
describe('GET /api/genres/:id', () => {
  it('should return 404 if genre is not found', async () => {
    const nonExistentId = 'aaaa12345678901234567890';
    const res = await request(app).get(`/api/genres/${nonExistentId}`);
    expect(res.body.error).toEqual("Genre not found");
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
    await disconnect();
    const res = await request(app).get('/api/genres');
    expect(res.statusCode).toEqual(500);
    await connect();
  });
});