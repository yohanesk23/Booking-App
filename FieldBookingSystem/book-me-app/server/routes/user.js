const express = require("express");
const userController = require("../controllers/user");
const router = express.Router(); // create a router

router.get("/get_admin", userController.getAdmin);
router.put("/signIn", userController.signIn);
router.put("/signOut", userController.signOut);

module.exports = router; // export the router
