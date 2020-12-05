import { MessageEmbed } from "discord.js";
import { Command } from "../commands";
import { StockInfo } from "../types";

const { lookup, history } = require('yahoo-stocks');

const command: Command = {
    name: 'info',
    description: 'Display info for the specified stock',
    run: async (client, msg, args) => {
        let stock = {
            info: {} as StockInfo,
            lastClose: 0
        }
        try {
            stock.info = await lookup(args![0]);
            stock.lastClose = (await history(args![0], {range: '1d'})).previousClose;
        } catch (error) {
            console.error(error);
            return;
        }
        const priceChange = stock.info.currentPrice - stock.lastClose;
        const change = {
            price: priceChange,
            percent: priceChange/stock.lastClose*100
        }

        const embed = new MessageEmbed();
        embed.setTitle('Stock Info');
        embed.addField('Name', stock.info.name);
        embed.addField('Symbol', stock.info.symbol, true);
        embed.addField('Exchange', stock.info.exchange, true);
        embed.addField('Current Price', stock.info.currentPrice.toFixed(2), true);
        embed.addField('Yesterday\'s Price', stock.lastClose.toFixed(2), true);
        embed.addField('Price Change', `${change.price.toFixed(2)} (${change.percent.toFixed(2)}%)`, true);

        msg.channel.send(embed);
    }
}

export default command;