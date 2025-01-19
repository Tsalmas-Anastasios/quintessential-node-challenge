import { Request } from 'express';
import { PostGraphqlQueryParams } from '../graphql/query-models';
import { config } from '../config';
import { Post } from '../models';
import { utilsService } from './utilities.service';
import { schema } from '../graphql/Schema';
import { graphql } from 'graphql';



class GetPostsService {


    async getPosts(params?: { graphql?: PostGraphqlQueryParams, req?: Request }): Promise<Post[]> {

        let graphQueryParams;
        if (params?.graphql)
            graphQueryParams = utilsService.generateParamsStringForGraphql(params?.graphql);


        try {


            const result = await graphql({
                schema: schema,
                source: `
                    {
                        posts${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            post_id
                            user_id
                            title
                            graphic_url
                            description
                            likes
                            created_at
                            updated_at

                            comments{
                                comment_id
                                user_id
                                comment
                                created_at
                            }
                        }
                    }
                `,
                contextValue: params?.req || null,
            });



            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const posts: Post[] = result.data.posts as Post[];


            if (posts.length === 0)
                return Promise.resolve([]);

            return Promise.resolve(posts);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getPost(params?: { graphql: PostGraphqlQueryParams, req?: Request }): Promise<Post> {

        try {

            const posts: Post[] = await this.getPosts(params);
            if (posts.length === 0)
                return Promise.resolve(null);


            return Promise.resolve(posts[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



export const getPostsService = new GetPostsService();
