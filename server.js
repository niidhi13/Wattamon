const express = require("express");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

/* ---------- Cloudinary Config ---------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.send("Wattmon server is running");
});

/* ---------- Unified Upload Endpoint ---------- */
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    let fileBuffer;
    let mimeType;

    // CASE 1: File sent (CSV / JSON file)
    if (req.file) {
      fileBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    }
    // CASE 2: Raw JSON sent
    else {
      const jsonString = JSON.stringify(req.body, null, 2);
      fileBuffer = Buffer.from(jsonString);
      mimeType = "application/json";
    }

    await cloudinary.uploader.upload(
      `data:${mimeType};base64,${fileBuffer.toString("base64")}`,
      {
        resource_type: "raw",
        folder: "wattmon-data",
        public_id: `wattmon-${Date.now()}`
      }
    );

    // Wattmon requirement
    return res.status(200).send("OK");

  } catch (error) {
    console.error("Upload error:", error);

    // Still return OK
    return res.status(200).send("OK");
  }
});

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
