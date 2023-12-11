import mongoose from 'mongoose';
import app from './app';
import { connect, disconnect } from './database';

const PORT = 3000;

const startServer = async () => {
  await connect();

  const connectionStatus = mongoose.connection.readyState;

  if (connectionStatus === 1) {
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log('Shutting down server...');
      await disconnect();

      server.close(() => {
        console.log('Server closed.');
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } else {
    console.error('Database connection failed. Server not started.');
  }
};

startServer();
