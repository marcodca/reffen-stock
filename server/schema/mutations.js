const graphql = require("graphql");
const Product = require("../models/product");
const MissingProductRecord = require("../models/missingProductRecord");
const { ProductType, MissingProductRecordType } = require("./types");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} = graphql;

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      addProduct: {
        type: ProductType,
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          category: { type: GraphQLNonNull(GraphQLString) },
          availableInBars: { type: GraphQLNonNull(new GraphQLList(GraphQLString)) },
          description: { type: GraphQLString }
        },
        resolve(parent, { name, category, availableInBars, description }) {
          let product = new Product({ name, category, availableInBars, description });
  
          return product.save();
        }
      },
      addMissingProductRecord: {
        type: MissingProductRecordType,
        args: {
          productId: { type: GraphQLNonNull(GraphQLID) },
          markedAsImportant: { type: GraphQLNonNull(GraphQLBoolean) },
          comment : { type : GraphQLString }
        },
        resolve(parent, { markedAsImportant, productId, comment }) {
          const dateAdded = new Date().toDateString();
  
          let missingProductRecord = new MissingProductRecord({
            productId,
            dateAdded,
            markedAsImportant,
            comment
          });
      
          return missingProductRecord.save();
        }
      },
      deleteMissingProductRecord : {
        type : MissingProductRecordType,
        args : { id : { type: GraphQLNonNull(GraphQLID) }},
        resolve(parent, {id}){
          return MissingProductRecord.findByIdAndDelete(id)
        }
      }
    }
  });

module.exports = { Mutation }; 