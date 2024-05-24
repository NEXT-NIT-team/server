// imports
import express, { Request, Response, NextFunction } from 'express';
import { unlinkSync } from 'fs';
import cors from 'cors';
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path';

// routes
import routesV1 from './routes/v1';

// middlewares
import { Limiter } from './middlewares/rateLimiter';
import useCompression from './middlewares/useCompression';
import language from './middlewares/language';
import translation from './middlewares/translation';


// core
import { NotFoundError, ApiError, InternalError } from './core/Error';
import Logger from './core/Logger';
import { ENVIRONEMENT, environment, node_env, WHITELIST } from './config';

// i18next translation
import i18next from 'i18next';
import i18nextMiddleware from "i18next-http-middleware"

// documentation
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './doc/swagger.json'
import { MulterFile } from 'app-request';


const app = express();

/**
 * @Logger
 **/

app.use(morgan("tiny"))

/**
 * @RateLimiter
 **/

app.use(Limiter);

/**
 * @Security
 **/

app.use(helmet());

/**
 * * helmet.hsts sets the Strict-Transport-Security header. 
 * * This tells the browser to prefer HTTPS over HTTP. 
 * * The maxAge parameter lets the number of seconds browsers should remember to prefer HTTPS.  
 * * By default, this figure is 15552000 — or 180 days.
 * */

app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
}))

/** 
* * helmet.hidePoweredBy removes the X-Powered-By broswer, 
* * which can give valuable information to malicious users to exploit. In Express, 
* * this information is sent to the public by default.
* */

app.use(helmet.hidePoweredBy());

/**
* * helmet.isNoOpen sets the X-Download-Options header. 
* * This is specific to the vulnerabilities in IE 8 and forces 
* * potentially unsafe downloads to be saved 
* * and prevents the execution of HTML in your site’s context.
* */

app.use(helmet.ieNoOpen());

/**
* * helmet.xssFilter prevents cross-site scripting. 
* * While browsers come with a filter that prevents this by default, 
* * it is not evenly applied and bugginess can range depending on 
* * if the end-user is using Chrome, IE, Firefox, Safari, or something else.
* */

app.use(helmet.xssFilter());


/**
 * @Static
 * serve static public files
 **/

app.use(express.static('public'))

/**
 * * secure cross-origin requests and data transfers
 * * mitigate the risks of cross-origin HTTP requests
 */

app.use(function (req, res, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});


app.use(cors({
  origin: "*"
}));


app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true, parameterLimit: 50000 }));

/**
 * @Compression
 **/

app.use(useCompression)

/**
 * @Documentation
 **/

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @Translate
 * detect the user's preferred language
 * initializes i18next and configures it with the translations for the supported languages.
 * */

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .init(translation);

app.use(i18nextMiddleware.handle(i18next));
app.use(language)


/**
 * @Routes
 **/

app.use('/v1', routesV1);


/**
 * @Middleware_Error_Handler
 **/

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  // console.log(req.files);
  if (req.files)
    for (const key in req.files) {
      const files = ((req.files as unknown) as { [fieldname: string]: MulterFile[] })[key];
      files.forEach(file => {
        unlinkSync(file.path);
        console.log(`deleting file ${file.filename}`);
      })
    }

  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (node_env === 'development') {
      console.log(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});



export default app;
