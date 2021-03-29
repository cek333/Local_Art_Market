// Requiring necessary npm packages
const ArtistsDAO = require('./dao/ArtistsDAO');
const CustomersDAO = require('./dao/CustomersDAO');
const ItemsDAO = require('./dao/ItemsDAO');
const OrdersDAO = require('./dao/OrdersDAO');
const UsersDAO = require('./dao/UsersDAO');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// Requiring passport as we've configured it
const passport = require('./middleware/passport');

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 3001;

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Setup MongoDB collection for session storage
const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  databaseName: process.env.MONGODB_DB,
  collection: 'sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
});
// Catch errors
sessionStore.on('error', function(error) {
  console.log(error);
});

// We need to use sessions to keep track of our user's login status
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
  store: sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
const artistRoutes = require('./routes/artistRoutes');
const customerRoutes = require('./routes/customerRoutes');
const itemRoutes = require('./routes/itemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/artist', artistRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/user', userRoutes);

// If no API routes are hit, send the React app
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Syncing our database and logging a message to the user upon success
MongoClient.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await ArtistsDAO.injectDB(client);
    await CustomersDAO.injectDB(client);
    await ItemsDAO.injectDB(client);
    await OrdersDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    app.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
    });
  });
