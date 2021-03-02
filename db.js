const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC
    LIMIT 4`;
    return db.query(q);
};

module.exports.dynamicRouteSingleImage = (id) => {
    const q = `SELECT * FROM images WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.addImage = (url, username, title, description) => {
    const q = `
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getMoreImages = (id) => {
    const q = `
    SELECT id, url, title, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
    ) AS "lowestId" FROM images
    WHERE id <$1
    ORDER BY id DESC
    LIMIT 4
    `;
    const params = [id];
    return db.query(q, params);
};

exports.getComments = (id) => {
    const q = `SELECT username, comment, created_at
        FROM comments
        WHERE images_id = $1
        ORDER BY created_at DESC`;
    const params = [id];
    return db.query(q, params);
};

exports.addComments = (username, comment, images_id) => {
    const q = `INSERT INTO comments (username, comment, images_id)
    VALUES ($1, $2, $3)
    RETURNING *`;
    const params = [username, comment, images_id];
    return db.query(q, params);
};
