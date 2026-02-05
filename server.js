const express = require("express");
const cloudinary = require("cloudinary").v2;

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------- Cloudinary Config ---------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ---------- Health Check (optional) ---------- */
app.get("/", (req, res) => {
  res.send("Wattmon server is running");
});

/* ---------- Wattmon Upload Endpoint ---------- */
app.post("/upload", async (req, res) => {
  try {
    const receivedData = req.body;

    // Convert received JSON to string
    const jsonString = JSON.stringify(receivedData, null, 2);

    // Upload JSON as RAW file to Cloudinary
    await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(jsonString).toString("base64")}`,
      {
        resource_type: "raw",
        folder: "wattmon-data",
        public_id: `wattmon-${Date.now()}`
      }
    );

    // IMPORTANT: Wattmon expects exactly "OK"
    return res.status(200).send("OK");

  } catch (error) {
    console.error("Error while uploading data:", error);

    // Still return OK (Wattmon requirement)
    return res.status(200).send("OK");
  }
});

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


