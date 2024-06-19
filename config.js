module.exports = {
    binanceUrl: 'https://api.binance.com/api/v3/klines',
    symbol: 'BTCUSDT',
    interval: '1d',
    limit: 30,
    priceType: 4, // 1 = Open Price, 2 = Highest Price, 3 = Lowest Price, 4 = Close Price
    csvFilePath: 'bitcoin_prices.csv'
};
