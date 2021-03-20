const { ObjectId } = require('bson');

let items;

class ItemsDAO {
  static async injectDB(conn) {
    if (items) {
      return;
    }
    try {
      items = await conn.db(process.env.MONGODB_DB).collection('items');
    } catch (e) {
      console.error(`Unable to connect to collection: ${e}`);
    }
  }

  static addItem(name, quantity, price, picture, description, artistId, artistMoniker, categories) {
    return items.insertOne({
      name, quantity, price, picture, description, artistId, artistMoniker, categories
     });
  }

  static updateItem(id, name, quantity, price, picture, description, artistId, artistMoniker, categories) {
    return items.updateOne(
      { _id: ObjectId(id) },
      { $set: { name, quantity, price, picture, description, artistId, artistMoniker, categories } }
    );
  }

  static getItems() {
    return items.find({ }).toArray();
  }

  static getItemsByArtist(id) {
    return items.find({ artistId: ObjectId(id) }).toArray();
  }

  static deleteItem(id) {
    return items.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = ItemsDAO;
