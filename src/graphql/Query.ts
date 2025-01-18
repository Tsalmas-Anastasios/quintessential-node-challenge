import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { accountsDb } from '../lib/connectors/db/accounts-db';
import { utilsService } from '../lib/utilities.service';




interface QueryParams {
    limit: number;
    offset: number;
    query_string: string;
}




// tslint:disable-next-line:variable-name
const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({




    })

});

export { QueryType };
