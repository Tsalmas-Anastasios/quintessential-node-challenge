import { Request } from 'express';
import { PostCommentGraphqlQueryParams } from '../graphql/query-models';
import { config } from '../config';
import { PostComment } from '../models';
import { utilsService } from './utilities.service';
import { schema } from '../graphql/Schema';
import { graphql } from 'graphql';



class GetPostCommentsService {


    async getPostComments(params?: { graphql?: PostCommentGraphqlQueryParams, req?: Request }): Promise<PostComment[]> {

        let graphQueryParams;
        if (params?.graphql)
            graphQueryParams = utilsService.generateParamsStringForGraphql(params?.graphql);


        try {


            const result = await graphql({
                schema: schema,
                source: `
                    {
                        post_comments${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            comment_id
                            post_id
                            user_id
                            comment
                            created_at
                        }
                    }
                `,
                contextValue: params?.req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const post_comments: PostComment[] = result.data.post_comments as PostComment[];

            if (post_comments.length === 0)
                return Promise.resolve([]);

            return Promise.resolve(post_comments);

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async getPostComment(params: { graphql?: PostCommentGraphqlQueryParams, req?: Request }): Promise<PostComment> {

        try {

            const post_comments: PostComment[] = await this.getPostComments(params);
            if (post_comments.length === 0)
                return Promise.resolve(null);

            return Promise.reject(post_comments[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



export const getPostCommentsService = new GetPostCommentsService();
