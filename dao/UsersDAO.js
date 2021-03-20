const { ObjectId } = require('bson');

let users;

class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.MONGODB_DB).collection('users');
    } catch (e) {
      console.error(`Unable to connect to collection: ${e}`);
    }
  }

  static getUserById(id) {
    return users.findOne({ _id: ObjectId(id) });
  }

  static getUserByEmail(email, type) {
    return users.findOne({ email, type });
  }

  static addUser(email, password, type, typeId) {
    return users.insertOne({ email, password, type, typeId });
  }

  static deleteUser(id) {
    return users.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = UsersDAO;
