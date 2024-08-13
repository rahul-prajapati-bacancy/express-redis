const express = require("express");
const { redisCacheMiddleware } = require("../middlewares/redis");
const { UserController } = require("../controllers/users");

const router = express.Router()

router.get("/cache", redisCacheMiddleware(), UserController.getUsers);
router.get("/no-cache", UserController.getUsers);

module.exports = router;