const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const itemType = new GraphQLObjectType({
    name : 'Item',
    fields : () => ({
        id : {type: GraphQLString},
        name : {type : GraphQLString},
        category : {type : GraphQLString}
        // availableInBars
    })
});