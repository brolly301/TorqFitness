import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import routineRoutes from "./routes/routineRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import settingRoutes from "./routes/settingRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    console.log("---- RESPONSE ----");
    console.log(`${req.method} ${req.originalUrl}`);
    console.log("REQ BODY:", req.body);
    console.log("RES BODY:", body);
    console.log("------------------");

    return originalJson(body);
  };

  next();
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/settings", settingRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
