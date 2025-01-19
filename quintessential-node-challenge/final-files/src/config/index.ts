require('dotenv').config();


class Config {

    public production: boolean;

    public session_public_key: string;
    public session_expiration: string;
    public session_refresh_expiration: string;

    public nanoid_basic_alphabet: string;
    public nanoid_basic_length: number;


    constructor() {

        this.production = process.env.ENVIRONMENT_MODE !== 'development';

        this.session_public_key = process.env.SESSION_PUBLIC_KEY;
        this.session_expiration = process.env.SESSION_EXPIRATION;
        this.session_refresh_expiration = process.env.SESSION_REFRESH_EXPIRATION;

        // basic nanoid alphabet
        this.nanoid_basic_alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        this.nanoid_basic_length = 16;

    }

}


export const config = new Config();
