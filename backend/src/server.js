import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import Path from 'path';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';

const app = express();
const __dirname = Path.resolve();

const PORT = ENV.PORT || process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(Path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(Path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port: ${PORT}`);
  });

}).catch((err) => {
  console.error("❌ Database Connection Failed:", err);
  process.exit(1);
});
