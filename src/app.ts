import express, { Request, Response, Application } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler';
import swaggerDefinition from './swagger';
import healthCheckRouter from './routes/healthCheck';
import movieRoutes from './routes/movieRoutes';
import genreRoutes from './routes/genreRoutes';

const app: Application = express();
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

app.use(errorHandler);

export default app;
