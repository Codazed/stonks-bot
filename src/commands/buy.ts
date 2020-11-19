import { Command } from '../commands';
import { writeJSONSync } from 'fs-extra';
import { join } from 'path';

const { lookup } = require('yahoo-stocks');

const command: Command = {
    name: 'buy',
    description: 'Buy shares of stocks',
    run: async (client, msg, args) => {
        const user = msg.author;
        const portfolio = await client.getPortfolio(user.id);
        if (!portfolio) return;
        let stockInfo: StockInfo;
        try {
            stockInfo = await lookup(args![0]);
        } catch (error) {
            console.error(error);
            return;
        }
        
        let amount = 1;
        if (args![1]) amount = parseFloat(args![1]);
        const totalPrice = stockInfo.currentPrice * amount;
        if (totalPrice > portfolio.balance) return msg.reply('Your balance is not high enough to invest that much.');
        portfolio.balance -= totalPrice;
        portfolio.stocks.push({
            id: stockInfo.symbol,
            buyPrice: stockInfo.currentPrice,
            buyDate: new Date(),
            amount: amount,
        });
        client.savePortfolio(user.id, portfolio);
        return msg.reply(`Investment succeeded! You now own ${amount} share${amount > 1 ? 's' : ''} of ${stockInfo.name}! Your current balance is now \$${portfolio.balance.toFixed(2)}.`);
    }
}

interface StockInfo {
    symbol: string;
    name: string;
    exchange: string;
    currentPrice: number;
    highPrice: number;
    lowPrice: number;
    meanPrice: number;
    medianPrice: number;
}

export default command;