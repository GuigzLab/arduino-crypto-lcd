// Jhonny
var five = require("johnny-five");
board = new five.Board();
// Environment variables
require('dotenv').config()

const Crypto = require('./Crypto')
const fs = require('fs')

let c = new Crypto([{
        "BTC": {
            toFixed: 0
        }
    },
    {
        "ETH": {
            toFixed: 0
        }
    },
    {
        "LTC": {
            toFixed: 2
        }
    },
    {
        "ZEC": {
            toFixed: 2
        }
    }
], "EUR")

let screenLength = Math.ceil(c.data.length / 2)
// [['BTC','ETH'],['ZEC','LTC'],['USDC', undefined]]
let screens = []
for (let i = 0; i < screenLength; i++) {
    screens[i] = [c.symbols[i * 2], c.symbols[i * 2 + 1]]
}
let screenIndex = 0;
let getScreen = function () {
    (screenIndex + 1 <= screenLength) ? screenIndex++ : screenIndex = 1
    return screenIndex
}

const rp = require('request-promise');

// Options for the 
const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {
        'symbol': c.symbolsString,
        'convert': c.currency
    },
    headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY
    },
    json: true,
    gzip: true
}

// Code here
board.on("ready", function () {

    lcd = new five.LCD({
        // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
        // Arduino pin # 7    8    9  10  11  12
        pins: [7, 8, 9, 10, 11, 12],
        backlight: 6,
        rows: 2,
        cols: 16
    });
    // Tell the LCD you will use these characters:
    lcd.useChar("pointerright");
    lcd.useChar("euro");

    let getData = () => {
        // rp(requestOptions).then(response => {
        //     console.log(response.data)
        // })
        console.log("Refreshing data .....")
        fs.readFile('data.json', (err, d) => {
            if (err) throw err;
            data = JSON.parse(d).data;
            let display = () => {
                let acutalScreen = getScreen()
                let screenData = screens[acutalScreen - 1]
                lcd.clear()
                let cols = lcd.cols
                for (const key in screenData) {

                    let current = data[screenData[key]]
                    if (current !== undefined) {
                        let offset = c.crypto(screenData[key]).toFixed
                        lcd.cursor(key, 0)
                        lcd.print(`${current.symbol} :pointerright: ${current.quote.EUR.price.toFixed(offset)}:euro:`);
                        let currentChange = Math.round(current.quote.EUR.percent_change_24h).toString()
                        lcd.cursor(key, cols - currentChange.length - 1)
                        lcd.print(`${currentChange}%`)
                    }
                }
            }
            display()
            setInterval(display, 5000)
        })
    }

    getData()

    setInterval(getData, 600000);

    this.repl.inject({
        lcd: lcd
    });
});