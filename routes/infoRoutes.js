const ArtistsDAO = require('../dao/ArtistsDAO');
const CustomersDAO = require('../dao/CustomersDAO');
const PostalCodesDAO = require('../dao/PostalCodesDAO');
const express = require('express');
const router = express.Router();

router.route('/:id?')
  .get(async function(req, res) {
    try {
      let result;
      if (req.params.id) {
        if (req.user && req.user.type === 'artist') {
          // artist requesting customer's info
          result = await CustomersDAO.getProfile(req.params.id);
          res.json({ status: true, name: result.name, phone_number: result.address.phone_number });
        } else {
          // customer requesting artist's bio
          result = await ArtistsDAO.getProfile(req.params.id);
          res.json({ status: true, name: result.name, bio: result.bio, picture: result.picture });
        }
      } else {
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
          clientInfo.picture = result.picture;
        }
        res.json({ status: true, ...clientInfo });
      }
    } catch (e) {
      console.error(`Error occurred while getting user's profile, ${e}`);
      res.json({ status: false, message: "Unable to fetch user's profile." });
    }
  })
  .put(async function(req, res) {
    try {
      const { address, name, bio = '', picture = '' } = req.body;
      const code = address.postalcode.trim().toUpperCase().substring(0, 3);
      const city = address.city.trim();
      // Get location from address
      const locationResult = await Promise.all([
        // Seach by postalCode + city to filter ambiguous postal codes (like L9X)
        PostalCodesDAO.getLocationFromPostalCodeCity(code, city),
        // Search by postalCode only to filter out ambiguous cities (like East York vs Toronto)
        PostalCodesDAO.getLocationFromPostalCode(code)
      ]);
      let location = null;
      if (locationResult[0]) {
        location = locationResult[0].location;
      } else if (locationResult[1]) {
        location = locationResult[1].location;
      }
      if (!location) {
        res.json({ status: false, message: 'Could not determine location from address.' });
        return;
      }
      address.location = location;
      let result;
      if (req.user && req.user.type === 'artist') {
        result = await ArtistsDAO.updateProfile(req.user.typeId, address, name, bio, picture);
      } else if (req.user && req.user.type === 'customer') {
        result = await CustomersDAO.updateProfile(req.user.typeId, address, name);
      } else {
        res.json({ status: false, message: 'Invalid request' });
        return;
      }
      // console.log(result);
      // if (result.modifiedCount === 1) {
      //   res.json({ status: true, message: 'Profile successfully updated!' });
      // } else {
      //   // Set status to 400: Bad Request
      //   res.status(400).json({ status: false, message: 'Error occurred while updating artist profile!' });
      // }

      // If new data = old data, then result.modifiedCount = 0 (but result.matchedCount = 1)
      //   Just assume success!
      res.json({ status: true, message: 'Profile successfully updated!' });
    } catch (e) {
      // Unexpected error
      console.error(`Error occurred while updating artist profile! err=${e}`);
      res.status(500).json({ status: false, message: 'Error occurred while updating artist profile!' });
    }
  });

module.exports = router;
