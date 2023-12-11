import request from 'supertest';
import app from '../app';


// Test for GET /health-check
describe('GET /health-check', () => {
    it('should return 200 OK and the health status', async () => {
      const res = await request(app).get('/health-check');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ status: 'OK', message: 'Server is running' });
    });
  });

  // Test for GET /
describe('GET /', () => {
    it('should return "Hello World!"', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual('Hello World!');
    });
  });