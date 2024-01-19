# Simple Interview Bot

Simple Interview Bot is a Telegram bot designed to facilitate interviews by managing themes, questions, and options. It allows users to interact with various commands to handle interview-related tasks. Build your Interview.

## Features

- Create and manage interview themes.
- Add, update, and delete questions within themes.
- Add, update, and delete options for each question.
- Retrieve random questions on a specific theme.
- Explore a list of available commands.

## How To Use

1.  <pre>git clone https://github.com/oleh19127/simple-interview-bot.git .; rm -rf trunk .gitignore readme.md .git .gitattributes</pre>
1.  Write in the terminal:

    - Install Node Modules: **npm i**

    - Run for development: **npm run dev**

    - Run for production: **npm run start**

1.  Get your bot token from [Bot Father](https://t.me/BotFather) and put token to .env in the root folder of project
1.  Deploy this bot locally or on your server to access only your interview.
    It is used sqlite embedded database.
1.  Start a chat with simple-interview-bot on Telegram.
1.  Use the listed commands to explore features.
1.  Follow on-screen instructions for each command.

## Live Public Example

### [Simple Interview Bot](https://t.me/SimpleInterviewBot)

### Available Commands

1.  /get_random_question

    - Get random question on the topic

2.  /add_theme

    - Add the theme

3.  /update_theme

    - Update the theme

4.  /delete_theme

    - Delete the theme

5.  /add_question

    - Add question and options to theme

6.  /update_question

    - Update question

7.  /delete_question

    - Delete question

8.  /add_option

    - Add option

9.  /update_option

    - Update option

10. /delete_option

    - Delete option

11. /start

    - Start the bot

12. /help

    - Show all commands
