const graphql = require("graphql");
const Product = require("../models/product");
const MissingProductRecord = require("../models/missingProductRecord");
const { ProductType, MissingProductRecordType } = require("./types");

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLList,
  } = graphql;
  

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
      }
    }
  });

module.exports = { RootQuery };