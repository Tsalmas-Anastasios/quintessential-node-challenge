import { Application, Request, Response } from 'express';
import { utilsService } from '../../lib/utilities.service';


export class AuthLogoutRoutes {


    public createRoutes(app: Application) {


        // logout route
        app.route('/api/auth/logout')
            .post(async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  body: { refresh_token: string }



                const refresh_token: string = req.body?.refresh_token || null;
                if (!refresh_token)
                    return res.status(403).send({ code: 403, type: 'refresh_token_missing', message: 'Refresh token is required but missing' });


                // delete tokens from db - START
                try {

                    await utilsService.tokenAuthentication.deleteTokensRecord(refresh_token);

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }
                // delete tokens from db - END



                return res.status(200).send({ code: 200, type: '200 OK', message: 'User logout successfully' });

            });


    }


}
