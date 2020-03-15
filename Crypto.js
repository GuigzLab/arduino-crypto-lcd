module.exports = class Crypto {
    constructor(data, currency) {
        this.data = data
        this.currency = currency
        this.symbols = data.map((e) => Object.keys(e)[0])
    }

    crypto(e) {
        // console.log(e)
        return this.data.filter((o) => Object.keys(o)[0] === e)[0][e]
    }

    get symbolsString() {
        return this.symbols.join(',')
    }
}