import { Application, Request, Response } from 'express';
import { utilsService } from '../lib/utilities.service';



export class IndexRoutes {

    public createRoutes(app: Application): void {


        app.route('/')
            .get(async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  NONE

                return res.status(200).send({ message: 'Hi!' });

            });


    }

}
