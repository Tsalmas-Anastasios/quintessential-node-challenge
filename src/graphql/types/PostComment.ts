import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';



// tslint:disable-next-line:variable-name
const PostCommentType = new GraphQLObjectType({

    name: 'PostCommentType',
    fields: () => ({

        comment_id: { type: GraphQLString },
        post_id: { type: GraphQLString },
        user_id: { type: GraphQLString },
        comment: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },

    })

});


export { PostCommentType };
