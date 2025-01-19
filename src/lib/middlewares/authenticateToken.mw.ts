import { User } from '../../models';
import { config } from '../../config';
import { utilsService } from './../utilities.service';
import { Request, Response } from 'express';

export const authenticateToken = async (req: Request, res: Response, next: Function) => {

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token)
        return res.status(401).send({ code: 401, type: 'access_token_required', message: 'Access token is required' });


    const user_id = await utilsService.jwt.verify(token, config.session_public_key, async (error, decoded) => {

        if (error)
            return null;


        const userId = (decoded as any).user_id;

        try {

            const result = await utilsService.mysqlDb.query(`
                SELECT
                    rec_id
                FROM
                    auth_tokens
                WHERE
                    user_id = :user_id
                    AND access_token = :access_token
            `, {
                user_id: userId,
                access_token: token
            });

            if (result.rowsCount === 0)
                return null;


            return userId;

        } catch (error) {
            return null;
        }

    });



    // get user's data for request
    try {

        const user_result = await utilsService.mysqlDb.query(`SELECT * FROM users WHERE user_id = :user_id`, { user_id: user_id });

        if (user_result.rowsCount === 0)
            return res.status(404).send({ code: 404, type: 'user_not_found', message: 'User not found!' });


        const user = new User(user_result.rows[0]);
        delete user.password;


        (req as any).user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, type: 'internal_server_error', message: error.message });
    }

};
