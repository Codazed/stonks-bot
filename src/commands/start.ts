import { Command } from '../commands';
import { writeJSONSync } from 'fs-extra';
import { join } from 'path';

const command: Command = {
    name: 'start',
    description: 'Create your stock portfolio',
    run: async (client, msg) => {
        // if (client.portfolios.has(msg.author.id)) {
        //     return msg.reply('Your portfolio already exists!');
        // }
        // client.portfolios.set(msg.author.id, {
        //     balance: 1000,
        //     opened: Date.now(),
        //     stocks: []
        // });
        let portfolio = await client.getPortfolio(msg.author.id);
        if (portfolio) {
            return msg.reply('Your portfolio already exists!');
        }
        // await client.savePortfolio(msg.author.id, {
        //     balance: 1000,
        //     opened: Date.now(),
        //     stocks: []
        // });
        await client.createPortfolio(msg.author.id);
        return msg.reply('Your portfolio has been created, time to start investing!');
    }
}

export default command;