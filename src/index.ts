import { Client, Collection } from 'discord.js';
import { Handler } from './commands';
import { readdirSync } from 'fs-extra';
import path from 'path';
import { MongoClient } from 'mongodb';

const mongoUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}`;

export class Stonks {
    // portfolios: Collection<string, Portfolio>;
    handler: Handler;
    prefix: string;
    constructor() {
        // this.portfolios = new Collection();
        this.handler = new Handler(this);
        this.prefix = process.env.PREFIX!;
    }

    async createPortfolio(userId: string) {
        const mongo = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
        const db = mongo.db(process.env.MONGO_DB);
        const portfolio = {
            _id: userId,
            balance: 1000,
            opened: new Date(),
            stocks: []
        }
        await db.collection('portfolios').insertOne(portfolio);
        mongo.close();
    }

    async getPortfolio(userId: string): Promise<Portfolio | undefined> {
        const mongo = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
        const db = mongo.db(process.env.MONGO_DB);
        const portfolio = await db.collection('portfolios').findOne({'_id': userId});
        mongo.close();
        return portfolio;
    }

    async savePortfolio(userId: string, portfolioData: Portfolio) {
        const mongo = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
        const db = mongo.db(process.env.MONGO_DB);
        await db.collection('portfolios').replaceOne({'_id': userId}, portfolioData);
        mongo.close();
    }

    async go() {
        const client = new Client();

        // Register commands
        const commands = readdirSync(path.join(__dirname, 'commands'));
        commands.forEach(file => {
            import(`./commands/${file}`).then(command => {
                this.handler.commands.set(command.default.name, command.default);
            });
        });

        client.on('message', msg => {
            if (!msg.content.startsWith(this.prefix)) return;
            if (msg.guild === null) return;

            const args = msg.content.slice(this.prefix.length).split(/ +/);
            const msgCmd = args.shift()!.toLowerCase();
            if (!this.handler.commands.has(msgCmd)) return;
            this.handler.commands.get(msgCmd)?.run(this, msg, args);
        });
        
        client.on('ready', () => console.log('Logged in'));
        
        client.login(process.env.BOT_TOKEN);
    }

    later(delay: number) {
        return new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
    }
}

new Stonks().go();

export interface Portfolio {
    balance: number;
    opened: Date;
    stocks: {
        id: string,
        buyPrice: number,
        buyDate: Date,
        amount: number,
    }[];
}