import { Application, Request, Response } from 'express';
import { utilsService } from '../lib/utilities.service';
import { config } from '../config';
import { PostCommentGraphqlQueryParams } from '../graphql/query-models';
import { PostComment } from '../models';
import { getPostCommentsService } from '../lib';


export class CommentsRoutes {


    public createRoutes(app: Application) {



        // fetch comments for posts
        app.route('/api/posts/:post_id/comments')
            .get(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: string }
                //  query_params: { page: number, limit: number }



                const query_params: PostCommentGraphqlQueryParams = {
                    post_id: req.params.post_id.toString(),
                    page: req?.query?.page ? Number(req.query.page) : 0,
                    limit: req?.query?.limit ? Number(req.query.limit) : 0
                };




                try {

                    const post_comments: PostComment[] = await getPostCommentsService.getPostComments({ graphql: query_params, req: req });

                    const meta: any = {};
                    meta['post_id'] = query_params.post_id;
                    meta['page'] = query_params.page;
                    meta['limit'] = query_params.limit;

                    // TODO: next, previous pages

                    return res.status(200).send({
                        ...meta,
                        comments: post_comments
                    });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message, error: error });
                }


            });




        // specific post
        app.route('/api/posts/:post_id/comments/:comment_id')
            .get(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: string, comment_id: string }

                const params: { post_id: string, comment_id: string } = {
                    post_id: req.params.post_id.toString(),
                    comment_id: req.params.comment_id.toString()
                };


                try {

                    const comment = await getPostCommentsService.getPostComment({ graphql: params, req: req });

                    return res.status(200).send(comment);

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }


            })
            .post(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: string, comment_id: 'new' }
                //  body: { comment: PostComment }



                const post_comment: PostComment = req.body?.comment ? new PostComment(req.body.comment) : null;
                const params: { post_id: string, comment_id: string } = {
                    post_id: req.params.post_id.toString(),
                    comment_id: req.params.comment_id.toString()
                };

                if (!post_comment)
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'Post comment data missing' });

                if (params.comment_id !== 'new')
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'Wrong route' });



                post_comment.comment_id = `cmd_${utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.nanoid_basic_length })}`;
                post_comment.post_id = params.post_id;
                post_comment.user_id = (req.user as any).user_id;

                if (!utilsService.checkObjectRequiredFields({ required_fields: PostComment.required_fields, object_for_check: post_comment }))
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'missing_required_fields' });



                try {

                    const insertion_result = await utilsService.mysqlDb.query(`
                        INSERT INTO
                            post_comments
                        SET
                            comment_id = :comment_id,
                            user_id = :user_id,
                            post_id = :post_id,
                            comment = :comment
                    `, post_comment);


                    return res.status(200).send({ code: 200, type: 'post_comment_saved', message: 'Post comment saved successfully', comment_id: post_comment.comment_id });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }

            })
            .put(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: string, comment_id: string }
                //  body: { comment: PostComment }



                const post_comment: PostComment = req.body?.comment ? new PostComment(req.body.comment) : null;
                const params: { post_id: string, comment_id: string } = {
                    post_id: req.params.post_id.toString(),
                    comment_id: req.params.comment_id.toString()
                };


                if (!utilsService.checkObjectRequiredFields({ required_fields: PostComment.required_fields, object_for_check: post_comment }))
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'missing_required_fields' });


                post_comment.comment_id = params.comment_id;
                post_comment.post_id = params.post_id;
                post_comment.user_id = (req.user as any).user_id;
                post_comment.updated_at = new Date();

                try {

                    const update_result = await utilsService.mysqlDb.query(`
                        UPDATE
                            post_comments
                        SET
                            comment = :comment,
                            updated_at = :updated_at
                        WHERE
                            comment_id = :comment_id
                            AND post_id = :post_id
                            AND user_id = :user_id
                    `, post_comment);


                    return res.status(200).send({ code: 200, type: 'post_comment_updated', message: 'Post comment updated successfully' });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }

            })
            .delete(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  params: { post_id: string, comment_id: string }



                const params: { post_id: string, comment_id: string, user_id: string } = {
                    post_id: req.params.post_id.toString(),
                    comment_id: req.params.comment_id.toString(),
                    user_id: (req.user as any).user_id
                };


                try {

                    const deletion_result = await utilsService.mysqlDb.query(`DELETE FROM post_comments WHERE comment_id = :comment_id AND post_id = :post_id AND user_id = :user_id`, params);

                    return res.status(200).send({ code: 200, type: 'post_comment_deleted', message: 'Post comment deleted successfully' });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }

            });



    }


}
