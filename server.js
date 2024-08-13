const express = require("express");
const { initializeRedisClient } = require("./middlewares/redis");
const UserRoutes = require("./routes/users");
const { swaggerUi, swaggerSpec } = require("./swagger");
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


require("dotenv").config();
const PORT = process.env.PORT || 3000;

const initExpressApiServer = async () => {
    const app = express();
    app.use(express.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    await initializeRedisClient();

    app.get("/", (req, res) => {
        res.status(200).json({ healthcheck: true })
    });

    app.use('/api/v1/user', UserRoutes)

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

initExpressApiServer()
    .then()
    .catch((err) => console.error(err));