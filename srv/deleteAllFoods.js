const express = require('express');
const cds = require('@sap/cds');

const router = express.Router();

router.delete('/deleteAllFoods', async (req, res) => {
  try {
    const db = await cds.connect.to('db');
    const Foods = db.entities.Foods;

    await Foods.deleteAll();

    res.sendStatus(204); // Return success status code
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return error status code and message
  }
});

module.exports = router;
