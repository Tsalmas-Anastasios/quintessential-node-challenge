import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';



// tslint:disable-next-line:variable-name
const PostType = new GraphQLObjectType({

    name: 'PostType',
    fields: () => ({

        post_id: { type: GraphQLString },
        user_id: { type: GraphQLString },
        title: { type: GraphQLString },
        graphic_url: { type: GraphQLString },
        description: { type: GraphQLString },
        likes: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },

    })

});


export { PostType };
