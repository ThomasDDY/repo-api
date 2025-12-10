import express from "express";


const app = express();
const port = process.env.PORT || 3000;


app.get("/", (req, res) => {
res.json({ message: "Sample API is running!" });
});


app.get("/health", (req, res) => {
res.json({ status: "healthy" });
});


app.listen(port, () => console.log(`API running on port ${port}`));

app.get("/health", (req, res) => res.json({ status: "OK" }));