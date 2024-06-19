const axios = require('axios');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const { binanceUrl, symbol, interval, limit, csvFilePath, priceType } = require('./config');

// Fetch Bitcoin prices from Binance API
async function fetchBitcoinPrices() {
    try {
        const response = await axios.get(binanceUrl, {
            params: {
                symbol: symbol,
                interval: interval,
                limit: limit
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Binance API: "${error}"`);
        return null;
    }
}

// Here we will calculate average price from the given prices
function calculateAverage(prices) {
    const total = prices.reduce((sum, price) => sum + parseFloat(price[priceType]), 0); // Sum of closing prices
    return total / prices.length;
}

// Main function to fetch prices, calculate average and write to CSV
async function main() {
    // Fetch prices from Binance API
    const prices = await fetchBitcoinPrices();
    if (!prices) return;

    // Get last 7 days prices for analysis
    const lastSevenDaysPrices = prices.slice(-7);
    // Calculate average price for the last 30 days
    const averagePrice = calculateAverage(prices);

    console.log(`Average price over the last 30 days: "${averagePrice}"`);

    // Prepare data for CSV file
    const records = lastSevenDaysPrices.map(day => {
        const date = new Date(day[0]).toISOString().split('T')[0]; // Convert timestamp to date
        const closePrice = parseFloat(day[4]); // Get closing price
        // Calculate deviation from average price
        const deviation = ((closePrice - averagePrice) / averagePrice) * 100;
        return {
            date: date,
            closePrice: closePrice,
            averagePrice: averagePrice,
            deviation: deviation
        };
    });

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
        path: 'bitcoin_prices.csv',
        header: [
            { id: 'date', title: 'Date' },
            { id: 'closePrice', title: 'Close Price (USD)' },
            { id: 'averagePrice', title: '30-Day Average Price (USD)' },
            { id: 'deviation', title: 'Deviation (%)' }
        ]
    });

    // Write records to CSV file
    await csvWriter.writeRecords(records);
    console.log(`CSV file "${csvFilePath}" has been written successfully.`);
}

// Run the main function
main();
