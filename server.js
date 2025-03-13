const express = require("express");
const fileRouter = require("./routes/FileRouter/fileRouter.js");
const detailRouter = require("./routes/detailRouter/detailRouter.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Use the router for API endpoints
app.use("/file", fileRouter);
app.use("/details", detailRouter); // Use the detail router for movie details

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
