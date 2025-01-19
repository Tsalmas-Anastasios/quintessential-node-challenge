import * as mysql_ from 'mysql';
import { databaseConfig } from '../../config/db';
import { utilsService } from '../utilities.service';


export interface QueryResult {
    rows: any;
    rowsCount: number;
    fields: any;
}


export class MysqlDBPool {
    public _mysql = mysql_;
    public pool: mysql_.Pool;

    public poolConfig: mysql_.PoolConfig;

    constructor() {
        this.poolConfig = {
            connectionLimit: databaseConfig.mysql_db.limit,
            host: databaseConfig.mysql_db.host,
            user: databaseConfig.mysql_db.user,
            password: databaseConfig.mysql_db.password,
            database: databaseConfig.mysql_db.database,
            multipleStatements: databaseConfig.mysql_db.multipleStatements,
            charset: databaseConfig.mysql_db.charset,
            supportBigNumbers: true,
            ssl: databaseConfig.mysql_db.ssl,
            timezone: databaseConfig.mysql_db.timezone || 'UTC',
        };

        this.pool = mysql_.createPool(this.poolConfig);
    }



    query(sql: string, args?: object | any[], sub_obj_divider?: string): Promise<QueryResult> {
        return new Promise((resolve, reject) => {

            this.pool.getConnection((err, connection) => {

                if (err)
                    return reject(err);

                connection.config.queryFormat = (sqlQuery, values) => {
                    if (!values) return sqlQuery;
                    return sqlQuery.replace(/\:(\w+)/g, (txt, key) => {


                        if (sub_obj_divider)
                            if (txt.replace(/:/g, '').includes(sub_obj_divider)) {
                                const value = utilsService.getValueFromNestedObject(args, txt, sub_obj_divider);
                                if (typeof value === 'boolean')
                                    return connection.escape(value ? 1 : 0);
                                else
                                    return connection.escape(value);
                            }


                        if (values.hasOwnProperty(key))
                            if (typeof values[key] === 'boolean')
                                return connection.escape(values[key] ? 1 : 0);
                            else
                                return connection.escape(values[key]);

                        return txt;


                    });
                };



                // const query =
                connection.query(sql, args, (error, rows, fields) => {

                    connection.release();

                    if (error)
                        return reject(error);

                    return resolve({ rows: rows, rowsCount: rows?.length || 0, fields: fields });
                });

                // console.log(query.sql);

            });

        });

    }


}


export const mysqlDb = new MysqlDBPool();
