const express = require("express");

const app = express();

// to receive raw / json data
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ type: "*/*" }));

app.post("/upload", (req, res) => {
    console.log("Data received from Wattmon:");
    console.log(req.body);

    // IMPORTANT: respond EXACTLY "OK"
    res.status(200).send("OK");
});

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
