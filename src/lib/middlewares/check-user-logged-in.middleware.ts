import { NextFunction, Request, Response } from 'express';
import { config } from '../../config';


export const check_user_logged_in = async (req: Request, res: Response, next: NextFunction) => {

    // if (config.unauthorized_routes_allowed.includes(req.path))
    //     return next();

    if (!req.session?.user?.account_id)
        return res.status(401).send({ code: 401, type: 'unauthorized', message: 'Please sign in' });


    next();

};

