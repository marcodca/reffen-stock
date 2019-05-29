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
          comment: { type: GraphQLString }
        },
        resolve(parent, { name, category, availableInBars, comment }) {
     
          let product = new Product({ name, category, availableInBars, comment });
  
          return product.save();
        }
      },
      addMissingProductRecord: {
        type: MissingProductRecordType,
        args: {
          markedAsImportant: { type: GraphQLNonNull(GraphQLBoolean) },
          productId: { type: GraphQLNonNull(GraphQLID) }
        },
        resolve(parent, { markedAsImportant, productId }) {
          const dateAdded = new Date().toDateString();
  
          let missingProductRecord = new MissingProductRecord({
            markedAsImportant,
            productId,
            dateAdded
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