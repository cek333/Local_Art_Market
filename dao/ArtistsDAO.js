const { ObjectId } = require('bson');

let artists;

class ArtistsDAO {
  static async injectDB(conn) {
    if (artists) {
      return;
    }
    try {
      artists = await conn.db(process.env.MONGODB_DB).collection('artists');
    } catch (e) {
      console.error(`Unable to connect to collection: ${e}`);
    }
  }

  static createProfile() {
    return artists.insertOne({ name: '', bio: '', address: { location: null } });
  }

  static getProfile(id) {
    return artists.findOne({ _id: ObjectId(id) });
  }

  static updateProfile(id, address, name, bio) {
    return artists.updateOne(
      { _id: ObjectId(id) },
      { $set: { address, name, bio } }
    );
  }

  static deleteProfile(id) {
    return artists.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = ArtistsDAO;
