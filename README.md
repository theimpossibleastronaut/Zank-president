# Zank President
A game discovery server accepting registrations via udp datagrams.
Simple. Easy. No hassles.

# Running
npm install

npm start

# Communicating
Default port: 10101

Default settings: bindv6=true, bindv4=true, bindv6address=::0, bindv4address=0.0.0.0

# Api commands
Cammands will need te be received as followed:
COMMAND|param 1;param 2;param 3

|API Command|Value|Description|
|-|-|-|
|REGISTER|portnumber;gametype|Register src-ip with port, as game of type 'gametype'|
|UNREGISTER|portnumber|Remove from list|
|SETNAME|gameid;name using simple chars|Set a name for this game|
|PING|gameid|Send a PING message indicating aliveness|
|GAMES|list;gametype|List all games of type 'gametype'|

The server will always respond with ERR or with ACK to confirm the state.
If the message 'GAMES list' is sent, the server will reply with a list of games is the format:
ACK;gamelist\n
address;port;name\n

Games will be autoremoved after 10 minutes of inactivity. Keep your server PINGing.

Gameid's are based by hashing the src-ip and announce port using the first algorithm that getHashes returns. Nothing fancy.

Game type (second parameter of REGISTER and GAMES) is usually zank. But if you want to use the protocol for your own game give it another id.