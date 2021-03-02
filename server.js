const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("err in get images", err);
        });
});

app.get("/closeImage/:id", (req, res) => {
    console.log("req.params", req.params);
    let id = req.params.id;
    db.dynamicRouteSingleImage(id)
        .then(({ rows }) => {
            res.json({
                image: rows[0],
            });
        })
        .catch((err) => {
            console.log("err in dynamic route");
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("upload file");
    if (req.file) {
        const { title, username, description } = req.body;
        const { filename } = req.file;
        const url = config.s3Url + filename;
        db.addImage(url, title, username, description).then(({ rows }) => {
            res.json({
                success: true,
                image: rows[0],
            });
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/more/:lastId", (req, res) => {
    const lastId = req.params.lastId;
    console.log("lastId received from script: ", lastId);
    db.getMoreImages(lastId)
        .then(({ rows }) => {
            // console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error getting more images:", err.message);
        });
});

app.listen(8080, () => console.log("IB up and running..."));
