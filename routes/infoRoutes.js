const ArtistsDAO = require('../dao/ArtistsDAO');
const CustomersDAO = require('../dao/CustomersDAO');
const express = require('express');
const router = express.Router();

router.route('/')
  .get(async function(req, res) {
    try {
      let result;
      if (req.user && req.user.type === 'artist') {
        result = await ArtistsDAO.getProfile(req.user.typeId);
      } else if (req.user && req.user.type === 'customer') {
        result = await CustomersDAO.getProfile(req.user.typeId);
      } else {
        res.json({ status: false, message: 'Invalid request' });
        return;
      }
      const clientInfo = { name: result.name, address: result.address };
      if (req.user.type === 'artist') {
        clientInfo.bio = result.bio;
      }
      res.json({ status: true, ...clientInfo });
    } catch (e) {
      console.error(`Error occurred while getting user's profile, ${e}`);
      res.json({ status: false, message: "Unable to fetch user's profile." });
    }
  })
  .put(async function(req, res) {
    try {
      const { address, name, bio = '' } = req.body;
      address.location = { type: 'Point', coordinates: [-73.961704, 40.551234] };
      let result;
      if (req.user && req.user.type === 'artist') {
        result = await ArtistsDAO.updateProfile(req.user.typeId, address, name, bio);
      } else if (req.user && req.user.type === 'customer') {
        result = await CustomersDAO.updateProfile(req.user.typeId, address, name);
      } else {
        res.json({ status: false, message: 'Invalid request' });
        return;
      }
      // console.log(result);
      if (result.modifiedCount === 1) {
        res.json({ status: true, message: 'Profile successfully updated!' });
      } else {
        // Set status to 400: Bad Request
        res.status(400).json({ status: false, message: 'Error occurred while updating artist profile!' });
      }
    } catch (e) {
      // Unexpected error
      res.status(500).json({ status: false, message: 'Error occurred while updating artist profile!' });
    }
  });

module.exports = router;
