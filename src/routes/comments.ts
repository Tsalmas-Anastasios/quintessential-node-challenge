import { Application, Request, Response } from 'express';
import { utilsService } from '../lib/utilities.service';
import { config } from '../config';


export class CommentsRoutes {


    public createRoutes(app: Application) {



        // fetch comments for posts
        app.route('/api/posts/:post_id/comments')
            .get(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

            });




        // specific post
        app.route('/api/posts/:post_id/comments/:comment_id')
            .get(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

            })
            .post(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

            })
            .put(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

            })
            .delete(utilsService.middlewares.authenticateToken, async (req: Request, res: Response) => {

            });



    }


}
