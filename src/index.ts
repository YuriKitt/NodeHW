import express, { Request, Response, Application } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swagger';
import healthCheckRouter from './routes/healthCheck';
import movieRoutes from './routes/movieRoutes';
import genreRoutes from './routes/genreRoutes';

const app: Application = express();
const PORT = 3000;

const username = "epamhw";
const password = "epamnode";
const cluster = "epam.ovtqb1a.mongodb.net";
const databaseName = "EPAM";

const uri: string = `mongodb+srv://${username}:${password}@${cluster}/${databaseName}?retryWrites=true&w=majority`;

const options: ConnectOptions = {
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
};

async function run() {
  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB Connected");
    const connectionStatus = mongoose.connection.readyState;
    console.log(`Connection Status: ${connectionStatus === 1 ? 'Connected' : 'Disconnected'}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error: ", error.message);
    }
  }
}

run();

app.use(express.json());

const swaggerDocs = swaggerJsDoc({
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/movies', movieRoutes);

app.use('/api/genres', genreRoutes);

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World!');
});

app.use('/health-check', healthCheckRouter);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const shutdown = async () => {
  console.log('Shutting down server...');

  await mongoose.connection.close();
  console.log("MongoDB Disconnected");

  server.close(() => {
    console.log('Server closed.');
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);