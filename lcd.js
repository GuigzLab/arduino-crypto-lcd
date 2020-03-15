var five = require("johnny-five"),
    board, lcd;

const rp = require('request-promise');
const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {
        // 'start': '1',
        // 'limit': '5000',
        'symbol': 'BTC,ETH',
        'convert': 'EUR'
    },
    headers: {
        'X-CMC_PRO_API_KEY': '4c8441de-a573-4fd2-b871-50454f3c4aa5'
    },
    json: true,
    gzip: true
};

board = new five.Board();

board.on("ready", function () {

    lcd = new five.LCD({
        // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
        // Arduino pin # 7    8   9   10  11  12
        pins: [7, 8, 9, 10, 11, 12],
        backlight: 6,
        rows: 2,
        cols: 16


        // Options:
        // bitMode: 4 or 8, defaults to 4
        // lines: number of lines, defaults to 2
        // dots: matrix dimensions, defaults to "5x8"
    });

    // Tell the LCD you will use these characters:
    // lcd.useChar("check");
    lcd.useChar("pointerright");
    lcd.useChar("arrowright");
    lcd.useChar("euro");

    // Line 1: Hi rmurphey & hgstrp!
    // lcd.clear().print("rmurphey, hgstrp");
    // lcd.cursor(1, 0);
    let display = () => {rp(requestOptions).then(response => {
        lcd.clear()
        let cols = lcd.cols
        let btc = response.data.BTC;
        lcd.print(`${btc.symbol} :pointerright: ${Math.round(btc.quote.EUR.price)}:euro:`);
        let btcChange = Math.round(btc.quote.EUR.percent_change_24h).toString()
        lcd.cursor(0,cols - btcChange.length - 1)
        lcd.print(`${btcChange}%`)

        lcd.cursor(1, 0);
        let eth = response.data.ETH;
        lcd.print(`${eth.symbol} :pointerright: ${Math.round(eth.quote.EUR.price)}:euro:`);
        let ethChange = Math.round(eth.quote.EUR.percent_change_24h).toString()
        lcd.cursor(1,cols - ethChange.length - 1)
        lcd.print(`${ethChange}%`)
    })}

    display()

    // Wait 3 mins
    setInterval(display, 180000);
    // Line 2: I <3 johnny-five
    // lcd.print("I").write(7).print(" johnny-five");
    // can now be written as:
    // lcd.print("I :heart: johnny-five");

    // this.wait(3000, function () {
    //     lcd.clear().cursor(0, 0).print("I :check::heart: 2 :duck: :) guigz");
    // });

    this.repl.inject({
        lcd: lcd
    });
});