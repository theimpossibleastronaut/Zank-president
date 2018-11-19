// Little test script

const dgram = require( 'dgram' );
var port = '10101';
var host = '127.0.0.1';
var type = 'udp4';

var client = dgram.createSocket( type );
client.on( 'message', onServerMessage );

var commandList = [
	"REGISTER|7001;zank",
	"SETNAME|My Zank game",
	"GAMES|list;zank",
	"UNREGISTER|7001"
];

send( commandList[ 0 ] );

function onServerMessage( msg, info ) {
	console.log( msg.toString() + '\n' );
}

function send( message, cb ) {

	var cbFunc = defaultCallback;
	if ( cb ) cbFunc = cb;

	var buf = new Buffer( message );
	client.send( buf, 0, buf.length, port, host, cbFunc );

}

function defaultCallback( err, bytes ) {
	if ( err ) throw err;
	console.log( 'OUT: ' + commandList[ 0 ] );

	setTimeout( function() {
		if ( commandList.length > 1 ) {
			commandList = commandList.splice( 1 );
			send( commandList[ 0 ] );
		} else {
			client.close();
		}
	}, 2000 );
}