const OrdersDAO = require('../dao/OrdersDAO');
const ItemsDAO = require('../dao/ItemsDAO');
const express = require('express');
const router = express.Router();

router.route('/:id?')
  .get(async function(req, res) {
    try {
      let result;
      if (req.params.id) {
        result = await OrdersDAO.findOrder(req.params.id);
      } else {
        if (req.user && req.user.type === 'artist') {
          result = await OrdersDAO.findOrdersByArtist(req.user.typeId);
        } else if (req.user && req.user.type === 'customer') {
          result = await OrdersDAO.findOrdersByCustomer(req.user.typeId);
        } else {
          result = [];
        }
      }
      res.json(result);
    } catch (e) {
      console.error(`Error occurred while getting orders, ${e}`);
      // Return empty array
      res.json([]);
    }
  })
  .post(async function(req, res) {
    try {
      // console.log('post /api/order/:', req.body);
      const { items, total, artistId, artistName } = req.body;
      await OrdersDAO.addOrder(items, total, req.user.typeId, req.user.name, artistId, artistName);
      // Update quantities for items
      for (const item in items) {
        await ItemsDAO.updateQuantity(item.id, item.quantity * -1);
      }
      res.json({ status: true, message: 'Order successfully added!' });
    } catch (e) {
      // Unexpected error
      console.error(`Error occurred while adding order, ${e}`);
      res.status(500).json({ status: false, message: 'Error occurred while adding order!' });
    }
  })
  .put(async function(req, res) {
    if (req.params.id) {
      try {
        await OrdersDAO.markOrderComplete(req.params.id);
        res.json({ status: true, message: 'Order successfully updated!' });
      } catch (e) {
        // Unexpected error
        res.status(500).json({ status: false, message: 'Error occurred while updating order!' });
      }
    } else {
      // Valid id not specified
      res.status(400).json({ status: false, message: 'Please specify order ID!' });
    }
  })
  .delete(async function(req, res) {
    if (req.params.id) {
      try {
        const order = OrdersDAO.findOrder(req.params.id);
        if (order) {
          // Add items back to inventory
          for (const item in order.items) {
            await ItemsDAO.updateQuantity(item.id, item.quantity);
          }
          await OrdersDAO.deleteOrder(req.params.id);
          res.json({ status: true, message: 'Order successfully deleted!' });
        } else {
          // Set status to 400: Bad Request
          res.status(400).json({ status: false, message: 'Order ID not found!' });
        }
      } catch (e) {
        // Unexpected error
        res.status(500).json({ status: false, message: 'Error occurred while deleting order!' });
      }
    } else {
      // Valid id not specified
      res.status(400).json({ status: false, message: 'Please specify order ID!' });
    }
  });

module.exports = router;
