const express = require('express');
const jwt = require('jsonwebtoken');

const transactionsRoutes = (client) => {
  const router = express.Router();

  router.post('/', (req, res) => {
    const {
      title, shortDescription, description, price, artistId, userId,
    } = req.body;

    client.query('INSERT INTO transactions VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, DEFAULT) RETURNING *', [artistId, userId, title, shortDescription, description, price], (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong.' });
      }

      return res.status(200).json({ success: true, message: 'Transaction completed successfully', data: result.rows[0] });
    });
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;

    if (id === 'undefined' || id === 'null') {
      return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }

    return client.query("SELECT transaction_id, artist_id, CONCAT(first_name, ' ', last_name) AS artist_name, t.user_id, (SELECT CONCAT(first_name, ' ', last_name) FROM users AS sub WHERE sub.user_id = t.user_id) as customer_name, title, description, short_description, price, t.status FROM transactions AS t INNER JOIN users AS u ON u.user_id = t.artist_id WHERE t.artist_id = $1 OR t.user_id = $1", [id], (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong.' });
      }

      return res.status(200).json({ success: true, message: 'Transaction completed successfully', data: result.rows });
    });
  });

  router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { classification } = req.body;
    const { user_id: userId } = jwt.decode(req.headers.authorization.slice(7));
    const cancelledBy = classification === 'cancelled' ? userId : null;

    return client.query('SELECT * FROM transactions WHERE transaction_id = $1', [id], (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong' });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No corresponding transaction found' });
      }

      return client.query('UPDATE transactions SET status = $1, cancelled_by = $2 WHERE transaction_id = $3', [classification, cancelledBy, id], (transactionError, transactionsResult) => {
        if (transactionError) {
          return res.status(500).json({ success: false, message: 'Something went wrong' });
        }

        return res.status(200).json({ success: true, message: 'Transaction successfully updated.' });
      });
    });
  });

  return router;
};

module.exports = transactionsRoutes;
