import { handleWebSocketConnection } from "../controllers/websocketController.js";

async function websocketRoutes(fastify) {
  fastify.post("/chatbot", handleWebSocketConnection);
}

export default websocketRoutes;
