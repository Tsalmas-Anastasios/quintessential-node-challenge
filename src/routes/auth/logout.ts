import { Application, Request, Response } from 'express';
import { utilsService } from '../../lib/utilities.service';


export class AuthLogoutRoutes {


    public createRoutes(app: Application) {


        // logout route
        app.route('/api/auth/logout')
            .post(utilsService.checkAuth, async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  NONE



                try {

                    req.session.destroy(async (err) => {

                        if (err)
                            throw new Error(err);

                        return res.status(200).send({ code: 200, status: '200 OK', type: 'logout_successful', message: 'Logout OK' });

                    });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }

            });


    }


}
