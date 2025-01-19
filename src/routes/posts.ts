import { PostGraphqlQueryParams } from './../graphql/query-models/PostQuery';
import { Application, Request, Response } from 'express';
import { utilsService } from '../lib/utilities.service';
import { Post } from '../models';
import { getPostsService } from '../lib';
import { config } from '../config';


export class PostsRoutes {


    public createRoutes(app: Application) {



        // fetch posts
        app.route('/api/posts')
            .get(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  query_params: { current_user_id: int(0/1), ...PostGraphqlQueryParams }

                const query_params: { current_user_id?: boolean, graphql?: PostGraphqlQueryParams } = {
                    current_user_id: req?.query?.current_user_id ? true : false,
                    graphql: {}
                };


                // check for parameters - START
                if (req?.query?.user_id)
                    query_params.graphql.user_id = req.query.user_id.toString();

                query_params.graphql.page = Number(req.query.page) || 0;
                query_params.graphql.limit = Number(req.query.limit) || 100;

                if (req?.query?.order_by_date)
                    query_params.graphql.order_by_date = req.query.order_by_date.toString();

                if (query_params?.current_user_id)
                    query_params.graphql.user_id = (req.user as any).user_id;
                // check for parameters - END



                try {

                    const posts: Post[] = await getPostsService.getPosts({ graphql: query_params.graphql, req: req });


                    const meta: any = {
                        page: query_params.graphql.page,
                        count: query_params.graphql.limit,
                    };


                    const pages: { previous_pages: number, next_pages: number } = await utilsService.getPagesPagination({ current_page: query_params.graphql.page, limit: query_params.graphql.limit, db_table: 'post' });
                    meta['previous_pages'] = pages.previous_pages;
                    meta['next_pages'] = pages.next_pages;

                    return res.status(200).send({
                        ...meta,
                        posts: posts
                    });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message, error: error });
                }

            });





        app.route('/api/posts/:post_id')
            .get(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: string }



                const post_id = req.params.post_id;

                try {

                    const post = await getPostsService.getPost({ graphql: { post_id: post_id }, req: req });

                    return res.status(200).send(post);

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }

            })
            .post(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: 'new' }
                //  body: { post: Post }



                const post: Post = req.body?.post ? new Post(req.body.post) : null;

                if (!post)
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'Post data missing' });

                if (req.params.post_id !== 'new')
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'Wrong route' });

                if (!utilsService.checkObjectRequiredFields({ required_fields: Post.required_fields, object_for_check: post }))
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'missing_required_fields' });


                post.post_id = `pst_${utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.nanoid_basic_length })}`;
                post.user_id = (req.user as any).user_id;
                post.likes = 0;

                try {

                    const insertion_result = await utilsService.mysqlDb.query(`
                        INSERT INTO
                            posts
                        SET
                            post_id = :post_id,
                            user_id = :user_id,
                            title = :title,
                            graphic_url = :graphic_url,
                            description = :description,
                            likes = :likes
                    `, post);


                    return res.status(200).send({ code: 200, type: 'post_created', message: 'Post created successfully', post_id: post.post_id });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }

            })
            .put(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: string }
                //  body: { post: Post }



                const post: Post = req.body?.post ? new Post(req.body.post) : null;
                post.post_id = req.params.post_id;
                post.user_id = (req.user as any).user_id;
                post.updated_at = new Date();

                if (!utilsService.checkObjectRequiredFields({ required_fields: Post.required_fields, object_for_check: post }))
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'missing_required_fields' });


                try {

                    const update_result = await utilsService.mysqlDb.query(`
                        UPDATE
                            posts
                        SET
                            title = :title,
                            graphic_url = :graphic_url,
                            description = :description,
                            likes = :likes,
                            updated_at = :updated_at
                        WHERE
                            post_id = :post_id
                            AND user_id = :user_id
                    `, post);

                    return res.status(200).send({ code: 200, type: 'post_updated', message: 'Post updated successfully' });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }

            })
            .delete(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: string }



                const post_id = req.params.post_id;
                const user_id = (req.user as any).user_id;

                try {

                    const deletion_result = await utilsService.mysqlDb.query(`DELETE FROM posts WHERE post_id = :post_id AND user_id = :user_id`, { post_id: post_id, user_id: user_id });

                    return res.status(200).send({ code: 200, type: 'post_deleted', message: 'Post deleted successfully' });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }

            });



    }


}
