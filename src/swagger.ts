export default{
  info: {
    title: 'Health Check',
    description: 'Health Check API Information',
    version: '1.0.0',
    contact: {
      name: 'Developer',
    },
  },
  servers: [{
    url: 'http://localhost:3000'
  }],
  paths: {
    '/health-check': {
      get: {
        description: 'Check the health of the server',
        responses: {
          '200': {
            description: 'A successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string'
                    },
                    message: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
