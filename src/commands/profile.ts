import { MessageEmbed } from 'discord.js';
import { Command } from '../commands'

const command: Command = {
    name: 'profile',
    description: 'View portfolio info',
    run: async (client, msg) => {
        const user = msg.author;
        const portfolio = await client.getPortfolio(msg.author.id);
        if (!portfolio) return;

        const embed = new MessageEmbed();
        embed.setTitle('Portfolio Info');
        embed.setThumbnail(user.avatarURL()!);
        embed.addField('User', msg.member?.displayName);
        embed.addField('Balance', '$' + portfolio.balance.toFixed(2));
        embed.addField('Stocks Owned', portfolio.stocks.length > 0 ? portfolio.stocks.map(stock => stock.id + ': ' + stock.amount) : 'None');

        msg.channel.send(embed);
    }
}

export default command;