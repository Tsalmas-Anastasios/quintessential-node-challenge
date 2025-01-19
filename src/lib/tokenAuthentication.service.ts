import { config } from '../config';
import { utilsService } from './utilities.service';


class TokenAuthenticationService {


    generateAccessToken(user_id: string): string {
        return utilsService.jwt.sign({ user_id }, config.session_public_key, { expiresIn: config.session_expiration });
    }


    generateRefreshToken(user_id: string): string {
        return utilsService.jwt.sign({ user_id }, config.session_public_key, { expiresIn: config.session_refresh_expiration });
    }




    async refreshTokenExists(refresh_token: string): Promise<boolean> {

        try {

            const result = await utilsService.mysqlDb.query(`
                SELECT
                    rec_id
                FROM
                    auth_tokens
                WHERE
                    refresh_token = :refresh_token;
            `, { refresh_token: refresh_token });



            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    validateRefreshToken(refresh_token: string): boolean {

        const verify_result = utilsService.jwt.verify(refresh_token, config.session_public_key, (error, decoded) => {

            if (error)
                return false;

            return true;

        });



        return verify_result;

    }


}



export const tokenAuthenticationService = new TokenAuthenticationService();
