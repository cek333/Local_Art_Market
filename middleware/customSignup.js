const UsersDAO = require('../dao/UsersDAO');
const ArtistsDAO = require('../dao/ArtistsDAO');
const CustomersDAO = require('../dao/CustomersDAO');
const bcrypt = require('bcryptjs');

module.exports = async function(req, res, next) {
  const hashedPswd = bcrypt.hashSync(req.body.password, 10);
  const email = req.body.email;
  const type = req.body.type;
  let result;
  try {
    const checkUser = await UsersDAO.getUserByEmail(email, type);
    if (checkUser) {
      return res.status(400).json({ status: false, message: 'Email already exists! Login instead.' });
    }
    if (type === 'artist') {
      result = await ArtistsDAO.createProfile();
    } else {
      result = await CustomersDAO.createProfile();
    }
    const newId = result.insertedId;
    result = await UsersDAO.addUser(email, hashedPswd, type, newId);
    // const newUser = result.ops[0];
    // console.log('signup, new user:', newUser);
    next();
  } catch (e) {
    console.error(`Error occurred while adding new user, ${e}`);
    res.status(400).json({ status: false, message: 'Unknown error on signup.' });
  }
};