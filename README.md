# Zank President
A game discovery server accepting registrations via udp datagrams.
Simple. Easy. No hassles.

# Running
npm install

npm start

# Communicating
Default port: 10101

Default settings: bindv6=true, bindv4=true, bindaddress=0.0.0.0

# Api commands
|API Command|Value|Description|
|-|-|-|
|REGISTER|portnumber|Register src-ip with port|
|UNREGISTER|portnumber|Remove from list|
|SETNAME|name using simple chars|Set a name for this game|
|PING|random string|Send a PING message indicating aliveness|
|GAMES|list|List all games|

The server will always respond with ERR or with ACK to confirm the state.
If the message 'GAMES list' is sent, the server will reply with a list of games is the format:
OK\n
address;port;name\n