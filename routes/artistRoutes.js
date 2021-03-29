const ArtistsDAO = require('../dao/ArtistsDAO');
const express = require('express');
const router = express.Router();

router.route('/')
  .get(async function(req, res) {
    try {
      if (req.user && req.user.type === 'artist') {
        const result = await ArtistsDAO.getProfile(req.user.typeId);
        res.json({ status: true, address: result.address, name: result.name, bio: result.bio });
      } else {
        res.json({ status: false, message: 'Invalid request' });
      }
    } catch (e) {
      console.error(`Error occurred while getting artist's profile, ${e}`);
      res.json({ status: false, message: "Unable to fetch artist's profile." });
    }
  })
  .put(async function(req, res) {
    try {
      const { address, name, bio } = req.body;
      const result = await ArtistsDAO.updateProfile(req.user.typeId, address, name, bio);
      if (result.nModified === 1) {
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
