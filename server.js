const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.json());

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ data }) => {
            console.log("response:", data);
            res.json(data);
        })
        .catch((err) => console.log("err", err));
});

app.listen(8080, () => console.log("IB up and running..."));
