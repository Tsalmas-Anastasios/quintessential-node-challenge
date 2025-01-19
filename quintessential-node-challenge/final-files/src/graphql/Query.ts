import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { utilsService } from '../lib/utilities.service';

import { PostType } from './types/Post';
import { PostCommentType } from './types/PostComment';




interface QueryParams {
    limit: number;
    offset: number;
    query_string: string;
}




// tslint:disable-next-line:variable-name
const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({


        // get posts
        posts: {
            type: new GraphQLList(PostType),
            args: {
                post_id: { type: GraphQLString },
                user_id: { type: GraphQLString },
                page: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                order_by_date: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                let order_by_date = '';
                if (args?.order_by_date && (args.order_by_date === 'asc' || args.order_by_date === 'desc')) {
                    order_by_date = `ORDER BY created_at ${args.order_by_date === 'desc' ? 'DESC' : 'ASC'}`;
                    delete args.order_by_date;
                }


                const queryParams: QueryParams = utilsService.createGraphqlSQLQuery(args, context);


                try {

                    const result = await utilsService.mysqlDb.query(`
                        SELECT
                            *
                        FROM
                            posts
                        ${queryParams?.query_string ? `WHERE ${queryParams.query_string}` : ``}
                        ${order_by_date}
                        LIMIT :limit
                        offset :offset
                    `, {
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },



        // get post comments
        post_comments: {
            type: new GraphQLList(PostCommentType),
            args: {
                post_id: { type: GraphQLString },
                user_id: { type: GraphQLString },
                page: { type: GraphQLInt },
                limit: { type: GraphQLInt },
            },
            resolve: async (record, args, context, info) => {

                const queryParams: QueryParams = utilsService.createGraphqlSQLQuery(args, context);


                try {

                    const result = await utilsService.mysqlDb.query(`
                        SELECT
                            *
                        FROM
                            post_comments
                        ${queryParams?.query_string ? `WHERE ${queryParams.query_string}` : ``}
                        ORDER BY created_at
                        LIMIT :limit
                        offset :offset
                    `, {
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        }


    })

});

export { QueryType };
