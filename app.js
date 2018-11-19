// Some simplistic game discovery server for Zank
// https://github.com/theimpossibleastronaut/zank

const dgram = require( 'dgram' );
const crypto = require( 'crypto' );

var gameIdAlgorithm = crypto.getHashes()[ 0 ];

var bindv6 = false;
var bindv4 = false;
var bindv6address = '::0';
var bindv4address = '0.0.0.0';
var bindport = 10101;

var s6, s4 = null;

var args = process.argv.slice( 2 );
args.forEach( function( val, ind, arr ) {
	if ( val.indexOf( '=' ) > 0 ) {
		var parts = val.split( '=' );

		switch ( parts[ 0 ] ) {
			case 'bindv6': bindv6 = true; bindv6address = parts[ 1 ].trim(); break;
			case 'bindv4': bindv4 = true; bindv4address = parts[ 1 ].trim(); break;
			case 'bindport': bindport = true; bindport = parts[ 1 ].trim(); break;

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

	s6.bind( bindport, bindv6address );
}

if ( bindv4 ) {
	s4 = dgram.createSocket( {
		type: 'udp4',
		reuseAddr: true
	} );

	s4.on( 'error', socketError );
	s4.on( 'message', socketMessage );
	s4.on( 'listening', socketListening );

	s4.bind( bindport, bindv4address );
}

function socketError( err ) {
	console.log( 'Server error:\n' + err.stack );
	process.exit( 1 );
}

function socketMessage( msg, rinfo ) {
	console.log( 'Message: "' + msg + '" from ' + rinfo.address + ':' + rinfo.port );

	var response = 'ERR';
	var result = processMessage( msg.toString(), rinfo );

	/*if ( result == "GAMES" ) {
		response = "ACK;gamelist\n";
		// Todo: append games list
		response += "100.100.100.100;7001;My Zank game\n";
	} else if ( result == true ) {
		response = "ACK";
	}*/

	if ( result === false ) {
		response = "ERR";
	} else if ( result === true ) {
		response = "ACK"
	} else {
		// Assume processmessage has formatted a message for us.
		response = result;
	}

	this.send( response, rinfo.port, rinfo.address, function( err ) {
		if ( err ) {
			console.log( 'Client ' + rinfo.address + ':' + rinfo.port + ' left prematurely' );
		}
	} );
}

function processMessage( msg, rinfo ) {

	var msgParts = msg.split( '|' );
	if ( msgParts.length !== 2 ) {
		return 'ERR;invalid message';
	}

	var command = msgParts[ 0 ].toUpperCase();
	var params = msgParts[ 1 ].trim().split( ';' );

	if ( params.length < 1 ) {
		return 'ERR;invalid param count';
	}

	switch( command ) {
		case 'REGISTER':
			if ( params.length == 2 ) {
				var gameIdMessage = 'ACK;';
				gameIdMessage += getGameIdFor( rinfo.address, params[ 0 ] );
				return gameIdMessage;
			}

			return 'ERR;invalid param count';
			break;

		case 'UNREGISTER':
			return true;
			break;

		case 'SETNAME':
			return true;
			break;

		case 'GAMES':
			if ( params[ 0 ] == 'list' && params.length == 2 ) {
				var gameListMessage = 'ACK;gameslist\n';
				gameListMessage += '100.100.100.100;7001;My Zank game\n';
				return gameListMessage;
			}

			return 'ERR;message not understood';
			break;

		default:
			return false;
	}

	return true;
}

function getGameIdFor( address, port ) {
	return crypto.createHash( gameIdAlgorithm )
			.update( address + ':' + port )
			.digest( 'hex' ).toUpperCase()
			.match( /.{1,6}/g ).join( '-' );
}

function socketListening( ) {
	console.log( 'Created listener for ' + this.address().family + ' at ' + this.address().address + ':' + this.address().port );
}