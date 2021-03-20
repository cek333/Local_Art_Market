const { ObjectId } = require('bson');

let orders;

class OrdersDAO {
  static async injectDB(conn) {
    if (orders) {
      return;
    }
    try {
      orders = await conn.db(process.env.MONGODB_DB).collection('orders');
    } catch (e) {
      console.error(`Unable to connect to collection: ${e}`);
    }
  }

  static addOrder(items, total, customerId, customerEmail, artistId, artistMoniker) {
    return items.insertOne({
      items, total, customerId, customerEmail, artistId, artistMoniker,
      dateOrdered: Date.now(), dateFulfiled: null, status: "Pending"
     });
  }

  static markOrderComplete(id) {
    return items.updateOne(
      { _id: ObjectId(id) },
      { $set: { dateFulfiled: Date.now(), status: "Complete" } }
    );
  }

  static findOrder(id) {
    return items.findOne({ _id: ObjectId(id) });
  }

  static findOrdersByArtist(id) {
    return items.find({ artistId: ObjectId(id), status: "Pending" }).toArray();
  }

  static findOrdersByCustomer(id) {
    return items.find({ customerId: ObjectId(id), status: "Pending" }).toArray();
  }

  static findOrdersByArtistIncludeCompleted(id) {
    return items.find({ artistId: ObjectId(id) }).toArray();
  }

  static findOrdersByCustomerIncludeCompleted(id) {
    return items.find({ customerId: ObjectId(id) }).toArray();
  }

  static deleteOrder(id) {
    return items.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = OrdersDAO;
