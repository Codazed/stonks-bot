import { MessageReaction, User } from 'discord.js';
import { Command } from '../commands';

const { lookup } = require('yahoo-stocks');

const command: Command = {
    name: 'sell',
    description: 'Sell shares of stocks',
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
        const validStocks = portfolio.stocks.filter(stock => stock.id === args![0]);
        const indexes = validStocks.map(stock => portfolio.stocks.indexOf(stock));
        if (validStocks.length === 0) return msg.reply('You don\'t own any shares of that stock!');

        let totalOwned = 0;
        validStocks.forEach(stock => totalOwned += stock.amount);
        const prices = validStocks.map(stock => stock.buyPrice);
        const avgPrice = (prices.reduce((a, b) => a + b))/prices.length;
        
        
        let amount = 1;
        if (args![1]) amount = parseInt(args![1]);

        if (amount > totalOwned) return msg.reply('You only own ' + totalOwned + ' shares of that stock!');

        const totalPrice = stockInfo.currentPrice * amount;
        portfolio.balance += totalPrice;

        let totalProfit = 0;

        validStocks.forEach(stock => {
            totalProfit += (stockInfo.currentPrice - stock.buyPrice);
        });

        const verifyMsg = await msg.reply(`Sell ${amount} of your shares of ${stockInfo.name}? You will make a ${totalProfit < 0 ? 'loss' : 'profit'} of \$${Math.abs(totalProfit)}. (✅: Yes, ❎: No)`);
        await Promise.all([verifyMsg.react('✅'), verifyMsg.react('❎')]);
        const filter = (reaction: MessageReaction, user: User) => (reaction.emoji.name === '❎' || reaction.emoji.name ==='✅') && user.id === msg.author.id;
        const r = await verifyMsg.awaitReactions(filter, { time: 15000, max: 1 });
        if (!r.has('❎') && !r.has('✅')) {
            verifyMsg.edit(`~~${verifyMsg.content}~~ Timed out.`);
            await client.later(5000);
            verifyMsg.delete();
            msg.delete();
            return;
        } else if (r.has('❎')) {
            verifyMsg.edit(`~~${verifyMsg.content}~~ Cancelled.`);
            await client.later(5000);
            verifyMsg.delete();
            msg.delete();
            return;
        }

        verifyMsg.delete();
        
        for (let i = 0; i < amount; i++) {
            const stock = portfolio.stocks[indexes[0]];
            stock.amount -= 1;
            // totalProfit += (stockInfo.currentPrice - stock.buyPrice);
            if (stock.amount <= 0) {
                indexes.shift();
            }
        }

        portfolio.stocks = portfolio.stocks.filter(stock => stock.amount > 0);

        client.savePortfolio(user.id, portfolio);
        return msg.reply(`You sold ${amount} of your shares of ${stockInfo.name} for \$${totalPrice}. You made a ${totalProfit < 0 ? 'loss' : 'profit'} of \$${Math.abs(totalProfit)}! Your balance is now ${portfolio.balance}`);
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