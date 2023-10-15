import express, { Request, Response, Application } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swagger';

const app: Application = express();
const PORT = 3000;

const swaggerDocs = swaggerJsDoc({
  definition: swaggerDefinition,
  apis: ['./src/index.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World!');
});

app.get('/health-check', (req: Request, res: Response): void => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
