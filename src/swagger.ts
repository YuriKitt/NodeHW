export default {
  openapi: '3.0.0',
  info: {
    title: 'Movie and Genre API',
    description: 'API for managing movies and genres',
    version: '1.0.0',
    contact: {
      name: 'Developer',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  components: {
    schemas: {
      Movie: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          releaseDate: {
            type: 'string',
            format: 'date-time',
          },
          genre: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['title', 'description', 'releaseDate', 'genre'],
      },
      Genre: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
        required: ['name'],
      },
    },
  },
};
