import { MessageEmbed } from "discord.js";
import { Command } from "../commands";
import { StockInfo } from "../types";

const { lookup } = require('yahoo-stocks');

const command: Command = {
    name: 'info',
    description: 'Display info for the specified stock',
    run: async (client, msg, args) => {
        let stockInfo: StockInfo;
        try {
            stockInfo = await lookup(args![0]);
        } catch (error) {
            console.error(error);
            return;
        }

        const embed = new MessageEmbed();
        embed.setTitle('Stock Info');
        embed.addField('Name', stockInfo.name);
        embed.addField('Symbol', stockInfo.symbol, true);
        embed.addField('Exchange', stockInfo.exchange, true);
        embed.addField('Current Price', stockInfo.currentPrice);
        embed.addField('Average Price', stockInfo.meanPrice, true);
        embed.addField('Low Price', stockInfo.lowPrice, true);
        embed.addField('High Price', stockInfo.highPrice, true);
        msg.channel.send(embed);
    }
}

export default command;