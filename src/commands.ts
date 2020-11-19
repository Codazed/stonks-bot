import { Collection, Message } from 'discord.js';
import { Stonks } from '.';

export class Handler {
    client: Stonks;
    commands: Collection<string, Command>;
    constructor(client: Stonks) {
        this.client = client;
        this.commands = new Collection<string, Command>();
    }

    run(name: string, message: Message) {
        if (!this.commands.has(name)) return;
        this.commands.get(name)!.run(this.client, message)
            .catch(console.error);
    }
}

export interface Command {
    name: string;
    description: string;
    run: (client: Stonks, message: Message, args?: string[]) => Promise<any>;
}