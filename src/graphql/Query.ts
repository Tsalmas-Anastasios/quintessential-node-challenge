import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { utilsService } from '../lib/utilities.service';
import { PostType } from './types/Post';




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

                const queryParams: QueryParams = utilsService.createGraphqlSQLQuery(args, context);

                let order_by_date = '';
                if (args?.order && (args.order === 'asc' || args.order === 'desc'))
                    order_by_date = `ORDER BY created_at ${args.order === 'desc' ? 'DESC' : 'ASC'}`;


                try {

                    const result = await utilsService.mysqlDb.query(`
                        SELECT
                            *
                        FROM
                            posts
                        ${queryParams?.query_string ? `WHERE ${queryParams.query_string}` : ``}
                        LIMIT :limit
                        offset :offset
                        ${order_by_date}
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
