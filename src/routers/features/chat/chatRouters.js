import express from "express";
import chatController from "../../../controllers/features/chat/chatController.js";
import loadConversation from "../../../controllers/features/chat/loadConversation.js";
import returnConversations from "../../../controllers/features/chat/returnAllConversations.js";
import deleteConversation from "../../../controllers/features/chat/deleteConversationController.js";

const chatRouter = express.Router();

// GET API endpoints for chat
chatRouter.get('/conversations', returnConversations)
chatRouter.get("/loadConversation/:id", loadConversation)

// POST API endpoints for chat
chatRouter.post("/", chatController);

// DELETE API endpoints for chat
chatRouter.delete("/deleteConversation/:id", deleteConversation)

export default chatRouter;