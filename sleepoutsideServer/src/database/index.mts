import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;
const databaseName = process.env.MONGO_DATABASE;

if (!uri) {
  throw new Error('MONGO_URI is not configured');
}

if (!databaseName) {
  throw new Error('MONGO_DATABASE is not configured');
}

const client = new MongoClient(uri, {
  family: 4,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let _db: MongoClient | null = null;

const initDb = async (callback: Function) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }

  try {
    await client.connect();
    _db = client;
    console.log('Connected to MongoDB!');
    callback(null, _db);
  } catch (err) {
    callback(err);
  }
};

const getDb = () => {
  if (!_db) {
    throw new Error('Db not initialized');
  }

  return _db.db(databaseName);
};

const closeDb = async () => {
  if (_db) {
    try {
      await _db.close();
    } finally {
      _db = null;
    }
  }
};

export default {
  initDb,
  getDb,
  closeDb,
};