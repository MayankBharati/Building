import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import websocketRoutes from "./routes/websocketRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import fastifyCors from "@fastify/cors";  // Import CORS plugin

dotenv.config();

const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

// Register the CORS plugin with options
fastify.register(fastifyCors, {
  origin: "*", // Replace with your Netlify frontend URL
  methods: ["GET", "POST"],  // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Required headers
  credentials: true,  // Support credentials like cookies or auth headers
});

fastify.register(websocketRoutes);
fastify.register(googleAuthRoutes);

// Error Handler
fastify.setErrorHandler((error, request, reply) => {
  console.error("Error:", error);
  reply.status(error.statusCode || 500).send({ error: error.message });
});

const PORT = process.env.PORT || 5000;
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});

fastify.get("/", async (request, reply) => {
  reply.send({ message: "Welcome to Index AI" });
});