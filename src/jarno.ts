// file: userRoutes.js

// Line 10 - helper that builds the vulnerable query
function buildUserQuery(userId) {
    // Vulnerable: string interpolation of untrusted input
    return `SELECT * FROM users WHERE id = ${userId}`;
  }
  
  // Line 16 - some unrelated utility code to push the fix further away
  function logRequest(req) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  
  function checkAuth(req) {
    // placeholder for auth logic
    return !!req.headers['x-api-key'];
  }
  
  function notFound(res) {
    res.status(404).send('Not found');
  }
  
  function badRequest(res, message) {
    res.status(400).send(message || 'Bad request');
  }
  
  // Many more unrelated helpers...
  function trackMetric(name, value) {
    console.log(`metric: ${name}=${value}`);
  }
  
  function sanitizeOutput(user) {
    // pretend this is doing something complex
    const { password, ...safeUser } = user;
    return safeUser;
  }
  
  // Line ~50 – main Express route where SAST reports the issue
  async function registerUserRoutes(app, db) {
    app.get('/user', async (req, res) => {
      logRequest(req);
      trackMetric('user_route_hit', 1);
  
      const userId = req.query.userId;
      if (!userId) {
        return badRequest(res, 'Missing userId');
      }
  
      // Line ~65 - SAST flags data flow here (sink)
      const query = buildUserQuery(userId);
      try {
        const result = await db.query(query); // SAST points to this call / this line
        if (!result.rows[0]) {
          return notFound(res);
        }
  
        const safeUser = sanitizeOutput(result.rows[0]);
        res.json(safeUser);
      } catch (err) {
        console.error('DB error', err);
        res.status(500).send('Internal server error');
      }
    });
  }
  
  module.exports = { registerUserRoutes };