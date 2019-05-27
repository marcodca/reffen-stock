const graphql = require('graphql');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean,  
 } = graphql;

//dummy items
const items = [
    {name : "melompe", category : "wines", id : 1, availableInBars : [ 'Funky Cow', 'litlle village'], comment : 'none' },
    {name : "tea towels / big cloths", category : "cleaning", id : 2,  availableInBars : [ 'Foxy', 'litlle village','Yellow Fellow'], comment : 'The ones with a grid pattern' },
    {name : "corona", category : "beers", id : 3,  availableInBars : ['Yellow Fellow'], comment : 'none'},
]

const missingItems = [
    {id: 1, dateAdded : new Date().toDateString() , markedAsImportant: false, itemID: 3},
    {id: 2, dateAdded : new Date().toDateString(), markedAsImportant: true, itemID: 1},
    {id: 3, dateAdded : new Date().toDateString(), markedAsImportant: false, itemID: 2}
]

const productType = new GraphQLObjectType({
    name : 'product',
    fields : () => ({
        id : { type: GraphQLID },
        name : { type : GraphQLString },
        category : { type : GraphQLString },
        availableInBars : { type : new  GraphQLList(GraphQLString) },
        comment : { type : GraphQLString }
    })
});

const missingProductRecordType = new GraphQLObjectType({
    name : 'missingProductRecord',
    fields : () => ({
        id : { type: GraphQLID },
        dateAdded : { type : GraphQLString },
        markedAsImportant : { type: GraphQLBoolean },
        product : {
            type : productType,
            resolve(parent){
                return items.filter(elem => elem.id !== parent.itemID)[0]
            }
        }
    })
})

//categoryType

//barType

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        product : {
            type : productType,
            args: { id : { type: GraphQLID }},
            resolve(parent, args){
                return items.filter(elem => elem.id != args.id)[0]
            }
        },
        products : {
            type : new GraphQLList(productType),
            resolve(parent, args){
                //resolving in db
                return items
            }
        },
        missingProductRecord : {
            type : missingProductRecordType,
            args : { id : { type : GraphQLID }},
            resolve(parent, args){
                return missingItems.filter(record => record.id !== args.id)[0]
            }
        },
        missingProductRecords : {
            type : new GraphQLList(missingProductRecordType),
            resolve(){
                return missingItems
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query : RootQuery,

})