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

  // static getUserById(id) {
  //   return users.findOne({ _id: ObjectId(id) });
  // }

  // static getUserByEmail(email, type) {
  //   return users.findOne({ email, type });
  // }

  static async getUserById(id) {
    // Don't know type yet, lookup in both artist and customer
    const queryPipeline = [
      { $match: { _id: ObjectId(id) } },
      {
        $lookup: {
          from: 'artists',
          localField: 'typeId',
          foreignField: '_id',
          as: 'artistInfo'
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'typeId',
          foreignField: '_id',
          as: 'customerInfo'
        }
      }
    ];
    return (await users.aggregate(queryPipeline)).next();
  }

  static async getUserByEmail(email, type) {
    if (type === 'artist') {
      const artistPipeline = [
        { $match: { email, type } },
        {
          $lookup: {
            from: 'artists',
            localField: 'typeId',
            foreignField: '_id',
            as: 'artistInfo'
          }
        }
      ];
      return (await users.aggregate(artistPipeline)).next();
    } else {
      const customerPipeline = [
        { $match: { email, type } },
        {
          $lookup: {
            from: 'customers',
            localField: 'typeId',
            foreignField: '_id',
            as: 'customerInfo'
          }
        }
      ];
      return (await users.aggregate(customerPipeline)).next();
    }
  }

  static addUser(email, password, type, typeId) {
    return users.insertOne({ email, password, type, typeId });
  }

  static deleteUser(id) {
    return users.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = UsersDAO;
