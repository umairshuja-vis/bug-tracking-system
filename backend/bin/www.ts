/**
 * Module dependencies.
 */

const app = require( '../app' );
const http = require( 'http' );
// const { Socket } = require( '../middleware' )
const config = require( 'config' )

/**
 * Get port from environment and store in Express.
 */

const port = Number( normalizePort( config.port || '3000' ) );
app.set( 'port', port );

/**
 * Create HTTP server.
 */

const server = http.createServer( app );

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen( port );
server.on( 'error', onError );
server.on( 'listening', onListening );
// Socket.initialize( server );

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort( val: string | number ) {
  const port = typeof val === 'string' ? parseInt(val, 10) : val;

  if ( isNaN( port ) ) {
    // named pipe
    return val;
  }

  if ( port >= 0 ) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError( error: NodeJS.ErrnoException ): void {
  if ( error.syscall !== 'listen' ) {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch ( error.code ) {
    case 'EACCES':
      console.error( `${bind} requires elevated privileges` );
      process.exit( 1 );
      break;
    case 'EADDRINUSE':
      console.error( `${bind} is already in use` );
      process.exit( 1 );
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log( `Listening on ${bind}` );
}

