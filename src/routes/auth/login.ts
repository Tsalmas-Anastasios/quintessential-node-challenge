import { Application, Request, Response } from 'express';
import { utilsService } from '../../lib/utilities.service';
import { User } from '../../models';



export class AuthLoginRoutes {


    public createRoutes(app: Application) {


        // local login
        app.route('/api/auth/login')
            .post(async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  body: { username: string, password: string }



                const login_data: { username: string; password: string } = {
                    username: req.body?.username || null,
                    password: req.body?.password || null,
                };



                // check submitted data
                if (!login_data?.username || !login_data?.password)
                    return res.status(403).send({ code: 403, type: 'bad_request', message: 'Login credentials are missing' });


                let find_user_query: string;
                if (utilsService.stringValidator.isEmail(login_data.username))
                    find_user_query = `SELECT * FROM users WHERE email = '${login_data.username}'`;
                else
                    find_user_query = `SELECT * FROM users WHERE username = '${login_data.username}'`;



                // execute searching for user - START
                let user: User;
                try {

                    const query_result = await utilsService.mysqlDb.query(find_user_query);

                    if (query_result.rowsCount === 0)
                        return res.status(404).send({ code: 404, type: 'user_not_found', message: 'User did not exist' });


                    user = new User(query_result.rows[0]);


                    if (!utilsService.bcrypt.compareSync(login_data.password.toString(), user.password.toString()))
                        return res.status(400).send({ code: 400, type: 'password_incorrect', message: 'Password is wrong (incorrect)' });


                    delete user.password;
                    delete login_data.password;


                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }
                // execute searching for user - END




                // get tokens here
                const access_token = utilsService.tokenAuthentication.generateAccessToken(user.user_id);
                const refresh_token = utilsService.tokenAuthentication.generateRefreshToken(user.user_id);



                // save tokens in db - START
                try {

                    const save_tokens_rslt = await utilsService.mysqlDb.query(`
                        INSERT INTO
                            auth_tokens
                        SET
                            user_id = :user_id,
                            access_token = :access_token,
                            refresh_token = :refresh_token

                        ON DUPLICATE KEY UPDATE
                            access_token = :access_token,
                            refresh_token = :refresh_token;
                    `, {
                        user_id: user.user_id,
                        access_token: access_token,
                        refresh_token: refresh_token
                    });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }
                // save tokens in db - START



                return res.status(200).send({
                    code: 200,
                    type: 'successful_authenticate',
                    message: 'User authenticated successfully',
                    tokens: {
                        access: access_token,
                        refresh: refresh_token
                    }
                });

            });



        // refresh login token
        app.route('/api/auth/refresh-login-token')
            .post(async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  body: { username: string, password: string }



                const refresh_token = req.body?.refresh_token || null;
                if (!refresh_token)
                    return res.status(403).send({ code: 403, type: 'refresh_token_missing', message: 'Refresh token is required but missing' });


                // check if the refresh token exists - START
                try {

                    if (await !utilsService.tokenAuthentication.refreshTokenExists(refresh_token))
                        return res.status(403).send({ code: 403, type: 'invalid_refresh_token', message: 'Invalid refresh token' });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }
                // check if the refresh token exists - END



                // validate the refresh token
                if (!utilsService.tokenAuthentication.validateRefreshToken(refresh_token))
                    return res.status(403).send({ code: 403, type: 'invalid_refresh_token', message: 'Invalid refresh token' });



                // generate new token - START
                const decoded_jwt = utilsService.decodeJsonWebTokenJWT({ jwt: refresh_token, completed: true });
                const newAccessToken = utilsService.tokenAuthentication.generateAccessToken(decoded_jwt.user_id);
                // generate new token - END



                // refresh the token in db - START
                try {

                    const refresh_token_result = await utilsService.mysqlDb.query(`
                        UPDATE
                            auth_tokens
                        SET
                            access_token = :access_token
                        WHERE
                            user_id = :user_id;
                    `, {
                        access_token: newAccessToken,
                        user_id: decoded_jwt.user_id
                    });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }
                // refresh the token in db - END



                return res.status(200).send({
                    code: 200,
                    type: 'access_token_refreshed',
                    message: 'Access token refreshed successfully',
                    new_token: newAccessToken,
                });

            });


    }


}
