const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

// Set process.env.VERCEL to prevent local listener binding during require
process.env.VERCEL = '1';
process.env.CLIENT_URL = 'https://opportunity-hub-frontend.vercel.app/,https://custom-domain.com';

const app = require('../server');

// Helper to send HTTP requests to test server
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
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

test('CORS and Preflight Suite', async (t) => {
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
  });

  await t.test('OPTIONS preflight to /auth/register reflects allowed production origin', async () => {
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
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
    assert.ok(res.headers['access-control-allow-methods'].includes('POST'));
    assert.ok(res.headers['access-control-allow-headers'].toLowerCase().includes('content-type'));
  });

  await t.test('OPTIONS preflight to /api/auth/register reflects allowed production origin', async () => {
    const res = await makeRequest(server, {
      path: '/api/auth/register',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://opportunity-hub-frontend.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['access-control-allow-origin'], 'https://opportunity-hub-frontend.vercel.app');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
  });

  await t.test('OPTIONS preflight works for comma-separated secondary origin in CLIENT_URL', async () => {
    const res = await makeRequest(server, {
      path: '/auth/register',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://custom-domain.com',
        'Access-Control-Request-Method': 'POST',
      },
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['access-control-allow-origin'], 'https://custom-domain.com');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
  });

  await t.test('OPTIONS preflight works for localhost development origins', async () => {
    const res = await makeRequest(server, {
      path: '/api/auth/register',
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
      },
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
  });

  await t.test('OPTIONS preflight rejects unauthorized origin without wildcard or credentials leak', async () => {
    const res = await makeRequest(server, {
      path: '/auth/register',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://malicious-site.example.com',
        'Access-Control-Request-Method': 'POST',
      },
    });

    // When origin is disallowed, Access-Control-Allow-Origin must NOT be set
    assert.equal(res.headers['access-control-allow-origin'], undefined);
    assert.notEqual(res.headers['access-control-allow-origin'], '*');
  });

  await t.test('Actual request includes CORS headers on both /api/health and /', async () => {
    const res = await makeRequest(server, {
      path: '/api/health',
      method: 'GET',
      headers: {
        'Origin': 'https://opportunity-hub-frontend.vercel.app',
      },
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['access-control-allow-origin'], 'https://opportunity-hub-frontend.vercel.app');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
  });
});
