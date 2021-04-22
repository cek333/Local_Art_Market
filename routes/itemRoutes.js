const ItemsDAO = require('../dao/ItemsDAO');
const express = require('express');
const router = express.Router();

router.route('/:id?')
  .get(async function(req, res) {
    try {
      let result;
      if (req.params.id) {
        result = await ItemsDAO.getItemById(req.params.id);
        if (result) {
          res.json({ status: true, ...result });
        } else {
          res.json({ status: false, message: 'Item not found' });
        }
      } else {
        if (req.user && req.user.type === 'artist') {
          result = await ItemsDAO.getItemsByArtist(req.user.typeId);
          // Mirror structure returned by searchItems i.e. result = { items: [] }
          result = { items: result };
        } else {
          const {
            searchTerm = '',
            category = '',
            priceLevel = '',
            longitude = '',
            latitude = ''
          } = req.query;
          let location = '';
          if (longitude && latitude) {
            location = {
              type: 'Point',
              coordinates: [Number(longitude), Number(latitude)]
            };
          }
          result = await ItemsDAO.searchItems(searchTerm, category, priceLevel, location);
          // Facet result is contained within array: result = [ { prices: ..., categories: ..., items: ... } ]
          result = result[0];
          // result = await ItemsDAO.getItems();
        }
        res.json(result);
      }
    } catch (e) {
      console.error(`Error occurred while getting items, ${e}`);
      // Return empty array
      res.json([]);
    }
  })
  .post(async function(req, res) {
    try {
      // console.log('post /api/items/:', req.body);
      const { name, quantity, price, picture, description, category } = req.body;
      await ItemsDAO.addItem(name, quantity, price, picture, description,
        req.user.typeId, req.user.name, category, req.user.location);
      res.json({ status: true, message: 'Item successfully added!' });
    } catch (e) {
      // Unexpected error
      console.error(`Error occurred while adding item, ${e}`);
      res.status(500).json({ status: false, message: 'Error occurred while adding item!' });
    }
  })
  .put(async function(req, res) {
    if (req.params.id) {
      try {
        const { name, quantity, price, picture, description, category } = req.body;
        const result = await ItemsDAO.updateItem(req.params.id, name, quantity, price, picture, description,
          req.user.typeId, req.user.name, category, req.user.location);
        // console.log('put /api/item/:id result=', result);
        if (result.modifiedCount === 1) {
          res.json({ status: true, message: 'Item successfully updated!' });
        } else {
          // Set status to 400: Bad Request
          res.status(400).json({ status: false, message: 'Item ID not found!' });
        }
      } catch (e) {
        // Unexpected error
        console.error('put /api/item/:id', e);
        res.status(500).json({ status: false, message: 'Error occurred while updating item!' });
      }
    } else {
      // Valid id not specified
      res.status(400).json({ status: false, message: 'Please specify item ID!' });
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
