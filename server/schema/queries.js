const graphql = require("graphql");
const Product = require("../models/product");
const MissingProductRecord = require("../models/missingProductRecord");
const Cocktails = require("../models/Cocktails");
const {
  ProductType,
  MissingProductRecordType,
  CocktailsType
} = require("./types");

const { GraphQLObjectType, GraphQLID, GraphQLList } = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Product.findById(id);
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve() {
        //resolving in db
        return Product.find({});
      }
    },
    missingProductRecord: {
      type: MissingProductRecordType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return MissingProductRecord.findById(id);
      }
    },
    missingProductRecords: {
      type: new GraphQLList(MissingProductRecordType),
      resolve() {
        return MissingProductRecord.find({});
      }
    },
    cocktailsCounter: {
      type: new GraphQLList(CocktailsType),
      resolve() {
        return Cocktails.find({});
      }
    }
  }
});

module.exports = { RootQuery };
