import express, { Request, Response, NextFunction } from 'express';
import createError from "http-errors"
import path from "path"
import cookieParser from "cookie-parser"
import multer from 'multer'
import cors from "cors"
import { db } from "./helpers"
import { routes } from "./routes"
import logger from "morgan"

const app = express();
app.use( '/uploads', express.static( 'uploads' ) );


app.use( cors() );
app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );


app.use( '/', routes );

const startServer = async () => {
  try {
    console.log( 'Connecting to Database...' );
    await db.sequelize.authenticate();
    await db.sequelize.sync( { force: false } );
    console.log( 'Database connected' );

  } catch ( error: any ) {
    console.log( 'Database Connection Error', error.message );
  }
};

startServer();

// catch 404 and forward to error handler
app.use( function ( _req: Request, _res: Response, next: NextFunction ) {
  console.log(_req.originalUrl);

  next( createError( 404 ) );
} );

// error handler
app.use( function ( err: any, req: Request, res: Response ) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

  // render the error page
  res.status( err.status || 500 );
  res.render( 'error' );
} );

module.exports = app;
