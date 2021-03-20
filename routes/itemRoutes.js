const ItemsDAO = require('../dao/ItemsDAO');
const express = require('express');
const router = express.Router();

router.route('/:id?')
  .get(async function(req, res) {
    try {
      let result;
      if (req.user && req.user.type === 'artist') {
        result = await ItemsDAO.getItemsByArtist(req.user._id);
      } else {
        result = await ItemsDAO.getItems();
      }
      res.json(result);
    } catch (e) {
      console.error(`Error occurred while getting items, ${e}`);
      // Return empty array
      res.json([]);
    }
  })
  .post(async function(req, res) {
    try {
      console.log('post /api/items/:', req.body);
      const { name, quantity, price, picture='', description, artistMoniker='', categories } = req.body;
      await ItemsDAO.addItem(name, quantity, price, picture, description, req.user._id, artistMoniker, categories);
      res.json({ status: true, message: 'Item successfully added!' });
    } catch (e) {
      // Unexpected error
      console.error(`Error occurred while adding item, ${e}`);
      res.status(500).json({ status: false, message: 'Error occurred while adding item!' });
    }
  })
  .delete(async function(req, res) {
    if (req.params.id) {
      try {
        const result = await ItemsDAO.deleteItem(req.params.id);
        if (result.deletedCount === 1) {
          res.json({ status: true, message: 'Item successfully deleted!' });
        } else {
          // Set status to 400: Bad Request
          res.status(400).json({ status: false, message: 'Item ID not found!' });
        }
      } catch (e) {
        // Unexpected error
        res.status(500).json({ status: false, message: 'Error occurred while deleting item!' });
      }
    } else {
      // Valid id not specified
      res.status(400).json({ status: false, message: 'Please specify item ID!' });
    }
  });

module.exports = router;
