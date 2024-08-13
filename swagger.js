const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require("dotenv").config()

const PORT = process.env.PORT || 3001

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express Redis Cache',
            version: '1.0.0',
            description: 'Express Redis Cache',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
