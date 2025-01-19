import { Application, Request, Response } from 'express';
import { utilsService } from '../lib/utilities.service';



export class IndexRoutes {

    public createRoutes(app: Application): void {


        app.route('/')
            .get(async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  NONE



                // if (req?.session?.user?.account_id)
                //     return res.status(200).send({
                //         message: 'You are successfully authenticated to use the system!',
                //         user: req.session.user,
                //     });

                return res.status(200).send({ message: 'Hi, you are unauthorized to have access in this system!' });

            });


    }

}
