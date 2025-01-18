require('dotenv').config();


class Config {

    public production: boolean;

    public nanoid_basic_alphabet: string;
    public nanoid_basic_length: number;


    constructor() {

        this.production = process.env.ENVIRONMENT_MODE !== 'development';

        // basic nanoid alphabet
        this.nanoid_basic_alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^*~-_=';
        this.nanoid_basic_length = 16;

    }

}


export const config = new Config();
