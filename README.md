# arduino-crypto-lcd
An Arduino lcd display using [Node.js](https://nodejs.org/en/) and [johnny-five](http://johnny-five.io/).

##Breadboard
![schema](https://raw.githubusercontent.com/rwaldron/johnny-five/master/docs/breadboard/lcd.png)

##Environment
Firmware/Runtime: `FirmataPlus.ino`
The JavaScript program is executed on a host machine that runs [Node.js](https://nodejs.org/en/). The program transmits basic IO instructions to the board via usb serial, which acts as a thin client. Requires tethering.

##Start
* `npm i`
* Create a `.env` file inside the directory which contains your own `API_KEY` from [CoinMarketCap](https://coinmarketcap.com/api/)
* `node lcd.js`
