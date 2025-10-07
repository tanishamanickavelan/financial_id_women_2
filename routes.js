const express = require("express");
const router = express.Router();
const registerCtrl = require("./controllers/register");
const UserController = require("./controllers/user");

// POST /api/register (new)
router.post('/register', registerCtrl.register);

// Keep existing /users endpoints (using controllers/user)
router.post('/users', UserController.addUser);
router.get('/users', UserController.getUsers);

module.exports = router;
