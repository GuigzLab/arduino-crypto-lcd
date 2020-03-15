const Twit = require('twit')
const config = require('./config.js')


const T = new Twit(config)
// T.post('statuses/update', {
//     status: 'hello world!'
// }, function (err, data, response) {
//     console.log(data)
// })

const cryptoArray = ['BTC', 'ETH']

const rp = require('request-promise');
const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {
        // 'start': '1',
        // 'limit': '5000',
        'symbol': cryptoArray.join(','),
        'convert': 'EUR'
    },
    headers: {
        'X-CMC_PRO_API_KEY': '4c8441de-a573-4fd2-b871-50454f3c4aa5'
    },
    json: true,
    gzip: true
};

let tweet = (T) => {
    rp(requestOptions).then(response => {
        let data = response.data;
        // let datas = Object.entries(response.data)
        // console.log(datas)
        
        const up = '📈'
        const down = '📉'
        
        for (const prop in data) {
            let message = ''
            const current = data[prop]
            console.log(current)
            message += `${current.name} (${current.symbol}) : ${current.quote.EUR.price.toFixed(2)} € \n`
            const hour = (current.quote.EUR.percent_change_1h > 0) ? '+' + current.quote.EUR.percent_change_1h.toFixed(2) : current.quote.EUR.percent_change_1h.toFixed(2)
            const day = (current.quote.EUR.percent_change_24h > 0) ? '+' + current.quote.EUR.percent_change_24h.toFixed(2) : current.quote.EUR.percent_change_24h.toFixed(2)
            const week = (current.quote.EUR.percent_change_7d > 0) ? '+' + current.quote.EUR.percent_change_7d.toFixed(2) : current.quote.EUR.percent_change_7d.toFixed(2)
            message += ` • ${hour}% for the last hour \n`
            message += ` • ${day}% for the last 24h \n`
            message += ` • ${week}% for the last week \n\n`
            message += new Date
            T.post('statuses/update', {
                status: message
            }, function (err, data, response) {
                console.log(data)
            })
        }
        
    }).catch((err) => {
        console.log('API call error:', err.message);
    });
}

tweet(T)
setInterval(() => {tweet(T)}, 3600000);