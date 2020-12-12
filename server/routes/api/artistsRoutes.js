const express = require('express');

const artistsRoutes = (client) => {
    const router = express.Router();
  
    router.get("/", (req, res) => {
      return client.query(
        `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id`,
        (error, result) => {
          if (error)
            return res
              .status(500)
              .json({ success: false, message: "Something went wrong." });
  
  
          return res.status(200).json(result.rows);
        }
      );
    });
  
    router.get("/:name", (req, res) => {
      return client.query(
        // `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id INNER JOIN artist_focus USING (artist_id) INNER JOIN focus USING (focus_id) WHERE CONCAT(first_name, ' ', last_name) ILIKE '%${req.params.name}%'`,
        `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id WHERE CONCAT(first_name, ' ', last_name) ILIKE $1`, [`%${req.params.name}%`],
        (error, result) => {
          if (error)
            return res
              .status(500)
              .json({ success: false, message: "Something went wrong." });
  
          return res.status(200).json(result.rows);
        }
      );
    });

    return router;
}


module.exports = artistsRoutes;