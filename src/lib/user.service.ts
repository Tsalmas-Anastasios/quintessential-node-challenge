import { config } from '../config';
import { User } from '../models';
import { utilsService } from './utilities.service';

class UserChecksService {


    async userExists(data: { user_id?: string, username?: string, email?: string, phone?: string }): Promise<boolean> {

        let queryWhereClause = '';

        for (const key in data)
            queryWhereClause += `AND ${key} = '${data[key]}'`;

        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');      // replace the first AND



        try {

            const result = await utilsService.mysqlDb.query(`
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    ${queryWhereClause}
            `);



            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class UserCreationPostService {


    async createUser(user: User): Promise<User> {

        // activate the user
        user.activated = true;

        user.user_id = `usr_${utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.nanoid_basic_length })}`;
        user.password = utilsService.generateHash(user.password);

        const insertion_string = utilsService.createMySQLColumnsQuery({ type: 'INSERT', query_fields: User.database_query_fields, properties_obj: user });


        try {

            const insertion_result = await utilsService.mysqlDb.query(`INSERT INTO users SET ${insertion_string};`, user);
            return Promise.resolve(user);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}


export const userChecksService = new UserChecksService();
export const userCreationPostService = new UserCreationPostService();
