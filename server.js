const express = require("express");
const fileRouter = require("./routes/FileRouter/fileRouter.js");
const detailRouter = require("./routes/detailRouter/detailRouter.js");
const anilistRouter = require("./routes/detailRouter/anilistRouter.js");
const audiobookRouter = require("./routes/detailRouter/audiobookRouter.js");
const subtitleRouter = require("./routes/subtitleRouter/subtitleRouter.js");
const musicRouter = require("./routes/detailRouter/musicRouter.js");
const initPg = require("./functions/init/init.js");
const movieDataRouter = require("./routes/dataRouter/movie/getMovieDetails.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initPg();

// Use the router for API endpoints
app.use("/file", fileRouter);
app.use("/details", detailRouter);
app.use("/details", anilistRouter);
app.use("/details", audiobookRouter);
app.use("/subtitles", subtitleRouter);
app.use("/details", musicRouter);
app.use("/content", movieDataRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
