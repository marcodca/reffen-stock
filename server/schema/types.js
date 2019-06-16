const graphql = require("graphql");
const Product = require("../models/product");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
} = graphql;

const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      category: { type: GraphQLString },
      availableInBars: { type: new GraphQLList(GraphQLString) },
      description: { type: GraphQLString }
    })
  });
  
  const MissingProductRecordType = new GraphQLObjectType({
    name: "MissingProductRecord",
    fields: () => ({
      id: { type: GraphQLID },
      dateAdded: { type: GraphQLString },
      comment: { type: GraphQLString },
      markedAsImportant: { type: GraphQLBoolean },
      product: {
        type: ProductType,
        resolve({ productId }) {
          return Product.findById(productId);
        }
      }
    })
  });

  module.exports = { ProductType, MissingProductRecordType };