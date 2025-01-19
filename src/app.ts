import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as cors from 'cors';
import * as https from 'https';
require('dotenv').config();

import { utilsService } from './lib/utilities.service';


import { IndexRoutes } from './routes/index';
import { AuthLoginRoutes } from './routes/auth/login';
import { AuthLogoutRoutes } from './routes/auth/logout';
import { Error404Routes } from './routes/errors/error-404';
import { UsersRegisterRoutes } from './routes/users/register';
import { PostsRoutes } from './routes/posts';


class App {

    private app: express.Application;

    constructor() {

        this.app = express(); // create express application instance
        this.app.set('PORT', process.env.BACKEND_PORT || 8080); // define the port globally

        this.config();
        this.routes();

    }



    private domains_list = [];



    // Server configuration
    private config(): void {


        this.app.use(express.json({ limit: '32mb' })); // support application/json type post data
        this.app.use(express.urlencoded({ extended: false, limit: '32mb' })); // support application/x-www-form-urlencoded post data



        this.app.use(cors({
            // origin: '*',
            origin: (origin, callback) => {

                if (!origin)
                    return callback(null, true);

                if (!this.domains_list.includes(origin))
                    return callback(null, false);                // to block --> (null, false)

                return callback(null, true);
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }));

        this.app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, X-Content-Type-Options');

            next();

        });


        this.app.set('trust proxy', true);


        // Start express server
        if (process.env.ENVIRONMENT_MODE === 'development') {

            const https_server = https.createServer({
                key: utilsService.fs.readFileSync(utilsService.path.join(__dirname, '/config/certs/server.key')),
                cert: utilsService.fs.readFileSync(utilsService.path.join(__dirname, '/config/certs/server.cert'))
            }, this.app);

            console.log('Starting server...');
            https_server.listen(this.app.get('PORT'), async () => {
                console.log(`Server is running on port: ${this.app.get('PORT')} (https://localhost:${this.app.get('PORT')})`);
                console.log('');
                console.log('');
            });

        } else
            this.app.listen(this.app.get('PORT'), () => {
                console.log('Server started');
            });

    }



    // Server routing
    private routes(): void {

        // index routes
        new IndexRoutes().createRoutes(this.app);

        // auth routes
        new AuthLoginRoutes().createRoutes(this.app);       // login
        new AuthLogoutRoutes().createRoutes(this.app);      // logout

        // users routes
        new UsersRegisterRoutes().createRoutes(this.app);   // register

        // posts routes
        new PostsRoutes().createRoutes(this.app);



        // error routes
        new Error404Routes().createRoutes(this.app);        // error 404

    }

}


const app = new App();
