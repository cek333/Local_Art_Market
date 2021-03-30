const { ObjectId } = require('bson');

let items;

class ItemsDAO {
  static async injectDB(conn) {
    if (items) {
      return;
    }
    // Create collection + index immediately if it doesn't exist
    conn.db(process.env.MONGODB_DB).collection('items', { strict: true }, async(err, col) => {
      if (err) {
        // Collection does not exist. Create collection.
        try {
          items = await conn.db(process.env.MONGODB_DB).createCollection('items');
        } catch (e) {
          console.error(`Unable to create collection: ${e}`);
        }
        // Create an index
        try {
          await items.createIndex({ category: 1, description: 'text' });
          await items.createIndex({ location: '2dsphere' });
        } catch (e) {
          console.error(`Unable to create indexes: ${e}`);
        }
      } else {
        items = col;
      }
    });
  }

  static addItem(name, quantity, price, picture, description, artistId, artistName, category, location) {
    return items.insertOne({
      name, quantity, price, picture, description, artistId, artistName, category, location
    });
  }

  static updateItem(id, name, quantity, price, picture, description, artistId, artistName, category, location) {
    // replace document with incoming document
    return items.updateOne(
      { _id: ObjectId(id) },
      { name, quantity, price, picture, description, artistId, artistName, category, location }
    );
  }

  static updateArtistInfo(artistId, artistName, location) {
    return items.updateMany(
      { artistId: ObjectId(artistId) },
      { $set: { artistName, location } }
    );
  }

  static updateQuantity(id, byNum) {
    return items.updateOne(
      { _id: ObjectId(id), quantity: { $ne: 'unlimited' } },
      { $inc: { quantity: byNum } }
    );
  }

  static getItems() {
    return items.find({ }).toArray();
  }

  static getItemsByArtist(artistId) {
    return items.find({ artistId: ObjectId(artistId) }).toArray();
  }

  static deleteItem(id) {
    return items.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = ItemsDAO;
