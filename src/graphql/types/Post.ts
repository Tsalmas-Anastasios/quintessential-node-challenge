import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { PostCommentType } from './PostComment';
import { Post } from 'models';
import { utilsService } from '../../lib/utilities.service';



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


        comments: {
            type: new GraphQLList(PostCommentType),
            resolve: async (post: Post, args, context, info) => {

                try {

                    const comments_result = await utilsService.mysqlDb.query(`
                        SELECT
                            *
                        FROM
                            post_comments
                        WHERE
                            post_id = :post_id;
                    `, { post_id: post.post_id });



                    for (const row of comments_result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return comments_result.rows;

                } catch (error) {
                    return [];
                }


            }
        }

    })

});


export { PostType };
