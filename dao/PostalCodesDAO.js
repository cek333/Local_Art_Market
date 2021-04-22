const path = require('path');
const fs = require('fs');

let postalCodes;

class PostalCodesDAO {
  static async injectDB(conn) {
    if (postalCodes) {
      return;
    }
    conn.db(process.env.MONGODB_DB).collection('postalCodes', { strict: true }, async(err, col) => {
      if (err && err.toString().includes('does not exist')) {
        // Create the collection
        try {
          postalCodes = await conn.db(process.env.MONGODB_DB).createCollection('postalCodes');
        } catch (err) {
          console.error(`Unable to create collection: ${err}`);
        }
        // Create an index
        try {
          await postalCodes.createIndex({ postalcode: 1, city: 'text' });
        } catch (err) {
          console.error(`Unable to create index for collection: ${err}`);
        }
        // Populate database
        try {
          await this.populateDatabase();
        } catch (err) {
          console.error(`Populating postalCode collection failed: ${err}`);
        }
      } else {
        postalCodes = col;
      }
    });
  }

  static getLocationFromPostalCodeCity(code, city) {
    const query = { postalcode: code, $text: { $search: city } };
    return postalCodes.findOne(query);
  }

  static getLocationFromPostalCode(code) {
    const query = { postalcode: code };
    return postalCodes.findOne(query);
  }

  static addEntry(code, city, location) {
    return postalCodes.insertOne({ postalcode: code, city, location });
  }

  static addMultipleEntries(docs) {
    // Each doc has format { postalcode, city, location }
    return postalCodes.insertMany(docs);
  }

  static async populateDatabase() {
    let data;
    try {
      data = fs.readFileSync(path.join(__dirname, '../data/geonames.org_CA.txt'), 'utf8');
    } catch (err) {
      console.error('Error populating postal code collection!', err);
    }
    const docs = [];
    const lines = data.split('\n');
    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length === 12) {
        const code = parts[1];
        const city = parts[2];
        const latitude = Number(parts[9]);
        const longitude = Number(parts[10]);
        docs.push({
          postalcode: code,
          city,
          location: { type: 'Point', coordinates: [longitude, latitude] }
        });
      }
    }
    try {
      await this.addMultipleEntries(docs);
    } catch (err) {
      console.error('Error populating postal code collection!', err);
      throw err;
    }
  }
}

module.exports = PostalCodesDAO;
