// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API Documentation',
      version: '1.0.0',
      description: 'Backend API for the EventPulse event management platform.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Development' },
      { url: 'https://your-vercel-url.vercel.app', description: 'Production (Update this later)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }], 
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;