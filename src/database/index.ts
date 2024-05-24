import mongoose from 'mongoose';
import Logger from '../core/Logger';
import { db, ENVIRONEMENT, environment } from '../config';
import Seeders from '../seeders';


/**  
 * @db string
 * Build the connection string
 * */

const dbURI = environment == ENVIRONEMENT.development
  ? "mongodb://127.0.0.1:27017/easyeats"
  : `mongodb://${db.user}:${db.password}@${db.host}:27017/${db.name}?authSource=admin&w=1`;


// const dbURI = "mongodb://127.0.0.1:27017/easyeats"

  
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};


// Create the database connection
mongoose
  .connect(dbURI, options)
  .then(() => {
    Logger.info('Mongoose connection done');
  })
  .catch((e) => {
    Logger.info('Mongoose connection error');
    Logger.error(e);
  });


const database = mongoose.connection;

// CONNECTION EVENTS
// When successfully connected
database.on('connected', () => {
  Logger.info('Mongoose default connection open');
});

// If the connection throws an error
database.on('error', (err) => {
  Logger.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
database.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


export const getDBStats = (): Promise<any> => {
  return database.db.command({
    dbStats: 1,
    scale: 1024,
    freeStorage: 1
  })
}


// initialize database
Seeders.init()