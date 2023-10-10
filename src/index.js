const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Health Check',
      description: 'Health Check API Information',
      contact: {
        name: 'Developer',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['./src/index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /health-check:
 *  get:
 *    description: Check the health of the server
 *    responses:
 *      '200':
 *        description: A successful response
 */

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
