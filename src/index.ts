import express, { Request, Response, Application } from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swagger';

const app: Application = express();
const PORT = 3000;

const uri: string = "mongodb+srv://epamhw:epamnode@epam.ovtqb1a.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.dir(err);
  } finally {
    await client.close();
  }
}

run();

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
