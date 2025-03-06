import express from "express";
import { registerRoutes } from "./routes";
import fileUpload from "express-fileupload";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

// Static dosyaları serve et
app.use(express.static(path.join(process.cwd(), "dist")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

(async () => {
  const server = await registerRoutes(app);

  // Tüm route'ları client tarafına yönlendir (SPA için)
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });

  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`Production server running on port ${port}`);
  });
})();
