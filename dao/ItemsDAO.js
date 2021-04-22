const { ObjectId } = require('bson');
const { PRICE_QUERY_MAP, PRICE_LEVELS } = require('../client/src/utils/constants_server');

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
          await items.createIndex({ name: 'text', description: 'text', artistName: 'text' });
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
    return items.replaceOne(
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

  static getItemById(itemId) {
    return items.findOne({ _id: ObjectId(itemId) });
  }

  static deleteItem(id) {
    return items.deleteOne({ _id: ObjectId(id) });
  }

  static async searchItems(searchTerm, category, priceLevel, location) {
    // Construct query
    let query = {};
    if (searchTerm) {
      query.$text = { $search: searchTerm };
    }
    if (category) {
      query.category = category;
    }
    if (priceLevel) {
      query.price = PRICE_QUERY_MAP[priceLevel];
    }
    // 1st Pipeline ($text search)
    const matchStage = { $match: query };
    const addFields = { $addFields: { score: { $meta: 'textScore' } } };
    const sortStageRelevance = { $sort: { score: { $meta: 'textScore' } } };
    const facetStage = {
      $facet: {
        prices: [
          {
            $bucket: {
              groupBy: '$price',
              boundaries: PRICE_LEVELS,
              default: 'other'
            }
          }
        ],
        categories: [{ $sortByCount: '$category' }],
        items: [{ $match: { } }] // pass through items that enter facet stage
      }
    };
    // First stage of pipeline is either $text search or $geoNear.
    //   If both enabled, we need to do two searches.
    let pipeline;
    if (searchTerm && location) {
      // Truth Table
      // searchTerm && location
      //     0            0 => 1 query (no sort)
      //     0            1 => 1 query (sort by distance, filter by category/price/neither)
      //     1            0 => 1 query (sort by relevance)
      //     1            1 => 2 querys (sort by distance, filter by _ids from 1st query)
      pipeline = [matchStage, addFields, sortStageRelevance];
      const result = await items.aggregate(pipeline).toArray();
      // Following parasomnist suggestion on stackoverflow:
      //   https://stackoverflow.com/questions/22595985/how-to-perform-text-search-together-with-geonear
      //   i.e. save the _id(s) from the text search, and use them as a filter in the geoNear search
      query = { _id: { $in: result.map(item => item._id) } };
    }
    if (location) {
      const sortStageDistance = {
        $geoNear: {
          near: location,
          distanceField: 'distance',
          distanceMultiplier: 0.001, // m to km
          query: query,
          spherical: true
        }
      };
      pipeline = [sortStageDistance, facetStage];
    } else {
      if (searchTerm) {
        // Sort by textScore of search term
        pipeline = [matchStage, addFields, sortStageRelevance, facetStage];
      } else {
        // No searchTerm or location
        pipeline = [matchStage, facetStage];
      }
    }
    return items.aggregate(pipeline).toArray();
  }
}

module.exports = ItemsDAO;
