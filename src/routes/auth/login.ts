import { Application, Request, Response } from 'express';



export class AuthLoginRoutes {


    public createRoutes(app: Application) {


        // local login
        app.route('/api/auth/login')
            .post(async (req: Request, res: Response) => {


            });


    }


}
