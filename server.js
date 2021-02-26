const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("public"));
app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            // console.log("response:", data);
            res.json(rows);
        })
        .catch((err) => console.log("err", err));
});

app.listen(8080, () => console.log("IB up and running..."));
