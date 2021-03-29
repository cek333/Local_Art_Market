const CustomersDAO = require('../dao/CustomersDAO');
const express = require('express');
const router = express.Router();

router.route('/')
  .get(async function(req, res) {
    try {
      if (req.user && req.user.type === 'customer') {
        const result = await CustomersDAO.getProfile(req.user.typeId);
        res.json({ status: true, address: result.address, name: result.name });
      } else {
        res.json({ status: false, message: 'Invalid request' });
      }
    } catch (e) {
      console.error(`Error occurred while getting customer's profile, ${e}`);
      res.json({ status: false, message: "Unable to fetch customer's profile." });
    }
  })
  .put(async function(req, res) {
    try {
      const { address, name } = req.body;
      const result = await CustomersDAO.updateProfile(req.user.typeId, address, name);
      if (result.nModified === 1) {
        res.json({ status: true, message: 'Profile successfully updated!' });
      } else {
        // Set status to 400: Bad Request
        res.status(400).json({ status: false, message: 'Error occurred while updating customer profile!' });
      }
    } catch (e) {
      // Unexpected error
      res.status(500).json({ status: false, message: 'Error occurred while updating customer profile!' });
    }
  });

module.exports = router;
