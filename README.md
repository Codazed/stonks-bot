# Stonks Bot
A Discord bot that allows you to play with the stock market

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Usage](#usage)
3. [License](#license)


## Prerequisites
- Node.js >= 12
- Discord bot token
- MongoDB server

To complete the bot's setup, create a `.env` file in the project root directory with the following values:
```env
BOT_TOKEN=<Discord Bot Token>
PREFIX=<The desired command prefix>
MONGO_HOST=<Hostname/IP of the MongoDB server>
MONGO_USER=<Username of the MongoDB user>
MONGO_PASS=<Password for the above MongoDB user>
MONGO_DB=<Database name inside the MongoDB server>
```

Then run `yarn go` or `npm run go` to start the bot.


## Usage
The following is the command reference for the bot (subject to change):

*($ represents the command prefix)*

- `$start`:

  This command creates a portfolio for the user who runs it. The bot will not work for users who don't run this command

- `$profile`:

  This command will display information about the portfolio for the user who runs it.

- `$buy <stock symbol> [amount]`:

  This command will buy the `amount` of the specified `stock symbol`. The `amount` argument is optional; the bot will default to an `amount` of **1** if it's not specified.

- `$sell <stock symbol> [amount]`:

  This command will sell the `amount` of the specified `stock symbol`. Like the **buy** command, the `amount` will default to **1** if it's not specified.

- `$info <stock symbol>`:

  This command will display information about the specified `stock symbol`.


## License
Like most of my other projects, Stonks Bot is licensed under the GNU GPL 3.0 license. See [LICENSE](LICENSE) for more information.
