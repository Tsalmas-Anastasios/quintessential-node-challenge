require('dotenv').config();


class DatabaseConfig {

    public mysql_db: any;

    constructor() {

        this.mysql_db = {
            host: process.env.DB__HOST,
            port: process.env.DB__PORT,
            user: process.env.DB__USERNAME,
            password: process.env.DB__PASSWORD,
            database: process.env.DB__DB_NAME,
            multipleStatements: process.env.DB__MULTIPLE_STATEMENTS,
            charset: process.env.DB__CHARSET,
            character_set_server: process.env.DB__CHARSET_SET_SERVER,
            connection_limit: process.env.DB__CONNECTION_LIMIT,
            timezone: process.env.DB__TIMEZONE,
        };

    }

}



export const databaseConfig = new DatabaseConfig();
