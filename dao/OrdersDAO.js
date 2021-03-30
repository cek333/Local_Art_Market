const { ObjectId } = require('bson');

let orders;
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

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

  static addOrder(items, total, customerId, customerName, artistId, artistName) {
    return orders.insertOne({
      items, total, customerId, customerName, artistId, artistName,
      dateOrdered: Date.now(), dateFulfilled: null, status: 'Pending'
    });
  }

  static markOrderComplete(id) {
    return orders.updateOne(
      { _id: ObjectId(id) },
      { $set: { dateFulfilled: Date.now(), status: 'Complete' } }
    );
  }

  static findOrder(id) {
    return orders.findOne({ _id: ObjectId(id) });
  }

  static findOrdersByArtist(artistId) {
    return orders.find({
      artistId: ObjectId(artistId),
      $or: [
        { dateOrdered: { $gt: Date.now() - ONE_WEEK } },
        { status: 'Pending' }
      ]
    }).toArray();
  }

  static findOrdersByCustomer(customerId) {
    return orders.find({
      customerId: ObjectId(customerId),
      $or: [
        { dateOrdered: { $gt: Date.now() - ONE_WEEK } },
        { status: 'Pending' }
      ]
    }).toArray();
  }

  static findOrdersByArtistIncludeCompleted(artistId) {
    return orders.find({ artistId: ObjectId(artistId) }).toArray();
  }

  static findOrdersByCustomerIncludeCompleted(customerId) {
    return orders.find({ customerId: ObjectId(customerId) }).toArray();
  }

  static deleteOrder(id) {
    return orders.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = OrdersDAO;
