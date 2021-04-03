const { ObjectId } = require('bson');

let customers;

class CustomersDAO {
  static async injectDB(conn) {
    if (customers) {
      return;
    }
    try {
      customers = await conn.db(process.env.MONGODB_DB).collection('customers');
    } catch (e) {
      console.error(`Unable to connect to collection: ${e}`);
    }
  }

  static createProfile() {
    return customers.insertOne({ name: '', address: { location: null } });
  }

  static getProfile(id) {
    return customers.findOne({ _id: ObjectId(id) });
  }

  static updateProfile(id, address, name) {
    return customers.updateOne(
      { _id: ObjectId(id) },
      { $set: { address, name } }
    );
  }

  static deleteProfile(id) {
    return customers.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = CustomersDAO;
