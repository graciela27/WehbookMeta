const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/WebhookController");

router.post("/",
    webhookController.events

)

router.get("/",
    webhookController.verifyToken
)

module.exports = router;