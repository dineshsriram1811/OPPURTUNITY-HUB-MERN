const dns = require('dns');
const mongoose = require('mongoose');

// On Windows and certain router/ISP configurations, local DNS resolvers refuse or fail to
// resolve SRV records (querySrv ECONNREFUSED _mongodb._tcp...).
// Setting reliable public DNS resolvers ensures SRV lookup succeeds seamlessly.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // If setting DNS servers fails or is not supported in this environment, continue with system defaults
}

/**
 * Connect to MongoDB Atlas cleanly with sanitized diagnostic logging.
 * Secrets (passwords/credentials) are never logged or exposed.
 */
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌  MongoDB Connection Error: MONGO_URI is not defined in environment variables.');
    console.error('ℹ️   Please verify that server/.env exists and contains a valid MONGO_URI.');
    throw new Error('MONGO_URI is missing');
  }

  // Safely extract cluster host and db name for diagnostics without exposing credentials
  let targetHost = 'unknown';
  let targetDb = 'unknown';
  try {
    const rawUri = process.env.MONGO_URI;
    const atSplit = rawUri.split('@');
    if (atSplit.length > 1) {
      const hostAndPath = atSplit[atSplit.length - 1];
      const slashIndex = hostAndPath.indexOf('/');
      if (slashIndex !== -1) {
        targetHost = hostAndPath.substring(0, slashIndex);
        targetDb = hostAndPath.substring(slashIndex + 1).split('?')[0] || 'default';
      } else {
        targetHost = hostAndPath.split('?')[0];
      }
    }
  } catch (parseErr) {
    // Non-fatal parse issue
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅  MongoDB Connected: ${conn.connection.host} [database: ${conn.connection.name}]`);
    return conn;
  } catch (error) {
    console.error(`❌  MongoDB Connection Error: ${error.message}`);

    if (error.message.includes('querySrv ECONNREFUSED') || error.code === 'ECONNREFUSED') {
      console.error('ℹ️   Diagnostic: Local DNS resolver refused SRV record lookup for cluster.');
      console.error(`ℹ️   Target Host: ${targetHost}`);
      console.error('ℹ️   Suggestion : Verify your network DNS settings or check whether the cluster hostname is correct in MongoDB Atlas.');
    } else if (error.message.includes('AuthenticationFailed') || error.code === 8000) {
      console.error('ℹ️   Diagnostic: Authentication failed for the MongoDB Atlas database user.');
      console.error('ℹ️   Suggestion : Check your username and password in server/.env.');
      console.error('ℹ️   Note       : If your password contains special characters like @, :, /, ?, %, they must be URL-encoded (e.g. @ -> %40).');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('ℹ️   Diagnostic: Could not reach MongoDB Atlas cluster nodes within the timeout period.');
      console.error(`ℹ️   Target Host: ${targetHost} | Database: ${targetDb}`);
      console.error('ℹ️   Suggestion : Check MongoDB Atlas -> Network Access -> IP Access List.');
      console.error('ℹ️                Ensure your current public IP is whitelisted (or add 0.0.0.0/0 for development access).');
    }

    throw error;
  }
};

module.exports = connectDB;

