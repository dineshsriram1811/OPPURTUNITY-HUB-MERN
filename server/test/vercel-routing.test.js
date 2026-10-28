const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

// Set process.env.VERCEL to simulate Vercel serverless runtime
process.env.VERCEL = '1';
process.env.CLIENT_URL = 'https://opportunity-hub-frontend.vercel.app';

// Import through the Vercel entrypoint (api/index.js)
const app = require('../api/index');

function makeRequest(server, options) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const port = address.port;
    const req = http.request({
      port,
      hostname: '127.0.0.1',
      ...options,
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsed,
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

test('Vercel Entrypoint and Routing Suite', async (t) => {
  let server;

  t.before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
  });

  t.after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  await t.test('Root endpoint GET / returns 200 and running status', async () => {
    const res = await makeRequest(server, { path: '/', method: 'GET' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'OK');
  });

  await t.test('Root alias GET /api returns 200 and running status', async () => {
    const res = await makeRequest(server, { path: '/api', method: 'GET' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'OK');
  });

  await t.test('Health check GET /api/health returns 200', async () => {
    const res = await makeRequest(server, { path: '/api/health', method: 'GET' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'OK');
    assert.equal(res.body.message, 'Opportunity Hub API is running');
  });

  await t.test('Health check GET /health returns 200', async () => {
    const res = await makeRequest(server, { path: '/health', method: 'GET' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'OK');
    assert.equal(res.body.message, 'Opportunity Hub API is running');
  });

  await t.test('OPTIONS /auth/register preflight succeeds with CORS headers', async () => {
    const res = await makeRequest(server, {
      path: '/auth/register',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://opportunity-hub-frontend.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['access-control-allow-origin'], 'https://opportunity-hub-frontend.vercel.app');
  });

  await t.test('OPTIONS /api/auth/register preflight succeeds with CORS headers', async () => {
    const res = await makeRequest(server, {
      path: '/api/auth/register',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://opportunity-hub-frontend.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['access-control-allow-origin'], 'https://opportunity-hub-frontend.vercel.app');
  });

  await t.test('POST /auth/register reaches auth controller (does not return Route /server.js not found)', async () => {
    const res = await makeRequest(server, {
      path: '/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://opportunity-hub-frontend.vercel.app',
      },
      body: {}, // empty body triggers validation failure in auth controller, proving route is reached
    });

    // The route MUST be found (status should not be 404 Route not found)
    assert.notEqual(res.statusCode, 404);
    assert.notEqual(res.body.message, 'Route /server.js not found');
    assert.notEqual(res.body.message, 'Route /auth/register not found');
  });

  await t.test('POST /api/auth/register reaches auth controller (does not return Route /server.js not found)', async () => {
    const res = await makeRequest(server, {
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://opportunity-hub-frontend.vercel.app',
      },
      body: {},
    });

    assert.notEqual(res.statusCode, 404);
    assert.notEqual(res.body.message, 'Route /server.js not found');
    assert.notEqual(res.body.message, 'Route /api/auth/register not found');
  });
});
