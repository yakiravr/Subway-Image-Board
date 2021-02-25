const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.json());

app.get("/images", (req, res) => {
    db.getImages()
        .then((data) => {
            console.log("response:", data);
            res.json(data);
        })
        .catch((err) => console.log("error in db.getImages sad puppy 🐶", err));
    console.log("hit the get route!");
});

app.listen(8080, () => console.log("IB up and running..."));
