// Some simplistic game discovery server for Zank
// https://github.com/theimpossibleastronaut/zank

const dgram = require( 'dgram' );
const port = 10101;

var bindv6 = false;
var bindv4 = false;
var bindv6address = '::0';
var bindv4address = '0.0.0.0';

var s6, s4 = null;

var args = process.argv.slice( 2 );
args.forEach( function( val, ind, arr ) {
	if ( val.indexOf( '=' ) > 0 ) {
		var parts = val.split( '=' );

		switch ( parts[ 0 ] ) {
			case 'bindv6': bindv6 = true; bindv6address = parts[ 1 ].trim(); break;
			case 'bindv4': bindv4 = true; bindv4address = parts[ 1 ].trim(); break;

			default: break;
		}
	}
} );

if ( !bindv6 && !bindv4 ) {
	console.error( 'No address/protocol bindings, specify bindv6= or bindv4=' );
	process.exit( 1 );
}

if ( bindv6 ) {
	s6 = dgram.createSocket( {
		type: 'udp6',
		reuseAddr: true
	} );

	s6.on( 'error', socketError );
	s6.on( 'message', socketMessage );
	s6.on( 'listening', socketListening );

	s6.bind( port, bindv6address );
}

if ( bindv4 ) {
	s4 = dgram.createSocket( {
		type: 'udp4',
		reuseAddr: true
	} );

	s4.on( 'error', socketError );
	s4.on( 'message', socketMessage );
	s4.on( 'listening', socketListening );

	s4.bind( port, bindv4address );
}

function socketError( err ) {
	console.log( 'Server error:\n' + err.stack );
	process.exit( 1 );
}

function socketMessage( msg, rinfo ) {
	console.log( 'Message: "' + msg + '" from ' + rinfo.address + ':' + rinfo.port );

	var response = 'ERR';
	var result = processMessage( msg.toString() );

	if ( result == "GAMES" ) {
		response = "OK\n";
		// Todo: append games list
	} else if ( result == true ) {
		response = "OK";
	}

	this.send( response, rinfo.port, rinfo.address, function( err ) {
		if ( err ) {
			console.log( 'Client ' + rinfo.address + ':' + rinfo.port + ' left prematurely' );
		}
	} );
}

function processMessage( msg ) {

	return true;
}

function socketListening( ) {
	console.log( 'Created listener for ' + this.address().family + ' at ' + this.address().address + ':' + this.address().port );
}