import { Application, Request, Response } from 'express';
import { User } from '../../models';
import { utilsService } from '../../lib/utilities.service';
import { userChecksService, userCreationPostService } from '../../lib';



export class UsersRegisterRoutes {


    public createRoutes(app: Application) {


        // user register
        app.route('/api/register')
            .post(async (req: Request, res: Response) => {

                // -------------------------- REQUEST DATA --------------------------
                //  body: { user: User }


                let user: User = req.body?.user ? new User(req.body.user) : null;
                if (!user)
                    return res.status(400).send({ code: 400, type: 'user_data_not_valid', message: 'The user data are not valid or not found' });



                // check required fields
                if (!utilsService.checkObjectRequiredFields({ required_fields: User.required_fields, object_for_check: user }))
                    return res.status(400).send({ code: 400, type: 'bad_request', message: 'Credentials to register the user are missing' });




                // check if the user exists - START
                try {

                    // username
                    if (await userChecksService.userExists({ username: user.username }))
                        return res.status(401).send({ code: 401, type: 'username_exists', message: 'Username already exists' });

                    // email
                    if (await userChecksService.userExists({ email: user.email }))
                        return res.status(401).send({ code: 401, type: 'email_exists', message: 'Email already exists' });

                    // phone
                    if (await userChecksService.userExists({ phone: user.phone }))
                        return res.status(401).send({ code: 401, type: 'phone_exists', message: 'Phone already exists' });

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }
                // check if the user exists - END



                // check password validation - START
                if (!utilsService.stringValidator.checkPasswordLength(user.password))
                    return res.status(402).send({ code: 402, type: 'password_out_of_range', message: 'Password length out of range' });

                if (!utilsService.stringValidator.checkPasswordStrength(user.password))
                    return res.status(402).send({ code: 402, type: 'password_not_strength', message: 'Password doesn\'t meet the criteria' });
                // check password validation - START




                // save new account - START
                try {

                    user = await userCreationPostService.createUser(user);
                    delete user.password;

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
                }
                // save new account - END




                return res.status(200).send({
                    code: 200,
                    type: 'user_account_created_successfully',
                    message: 'Account created successfully',
                    user_id: user.user_id
                });

            });


    }


}
