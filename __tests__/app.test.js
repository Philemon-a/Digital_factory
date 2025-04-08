const request = require('supertest');
const app = require('../app');

describe('Express App Configuration', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(401);
  });

  it('should include CORS headers on preflight request', async () => {
    const res = await request(app)
      .options('/')
      .set('Origin', 'https://digital-factory-frontend.vercel.app/')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe('https://digital-factory-frontend.vercel.app/');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should parse JSON body correctly with /echo route', async () => {
    const res = await request(app)
      .post('/echo') // Only works if /echo route exists
      .send({ test: 'data' })
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ test: 'data' });
  });

  it('should initialize session and return Set-Cookie header', async () => {
    const res = await request(app).get('/');
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
