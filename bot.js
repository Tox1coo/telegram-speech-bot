const open = require('./func/open');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const spawn = require('child_process').spawn;

const TELEGRAM_BOT_TOKEN = '5538937643:AAFS4YIM5MblCTbWGE9ozEIXeIpIFOrEOa0';
const YA_CLOUD_KEY = 'AQVN2eSnkw-7sj2nYmFdEfTPxEHSY865gJwdX_ut';

const emoji = require('node-emoji');
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});

const SHOCKED_HEAD = emoji.get('shocked_face_with_exploding_head');
const HUGGING = emoji.get('hugging_face');
const DIZZY_FACE = emoji.get('dizzy_face');
const EYES = emoji.get('eyes');
const WINK = emoji.get('wink');
const BUST_IN_SILHOUETTE = emoji.get('bust_in_silhouette');
const SPEAKING_HEAD_IN_SILHOUETTE = emoji.get('speaking_head_in_silhouette');
const CRY = emoji.get('cry');
const GAME = emoji.get('video_game');

bot.on('text', (message) => {
	const chatId = message.chat.id;
	if(message.text === '/start') {
		bot.sendMessage(chatId, `Привет! ${HUGGING}`);
		bot.sendMessage(chatId, `Список того, что я умею делать:
										1. Выключать пк. ${SHOCKED_HEAD}
										2. Перезагружать пк.${DIZZY_FACE}
										3. Открывать браузер. ${WINK}
										4. Открывать вк в браузере. ${BUST_IN_SILHOUETTE}
										5. Открывать ютуб в браузере. ${EYES}
										6. Открывать стим. ${GAME}
										7. Открывать дискорд. ${SPEAKING_HEAD_IN_SILHOUETTE}` );
	} else {
		bot.sendMessage(chatId, `Не понимаю тебя ${CRY}`);
	}
});
bot.on('voice', (msg) => {
	const stream = bot.getFileStream(msg.voice.file_id);
	const chatId = msg.chat.id;

	let chunks = [];

	stream.on('data', chunk => chunks.push(chunk));

	stream.on('end', () => {
		const axiosConfig = {
			method: 'POST',
			url: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
			headers: {
				Authorization: 'Api-Key ' + YA_CLOUD_KEY,
			},
			data: Buffer.concat(chunks)
		};

		axios(axiosConfig)
			.then(response => {
				const command = response.data.result.toLowerCase();

				if(command.search('выключи комп') != -1 || command.search('выруби комп') != -1) {

					bot.sendMessage(chatId, 'Выключаю компьютер!');
					if(command.search('через') !== -1) {

						const timeout = command.match(/\d+/);
						shutdown('shutdown', timeout[0]);
					} else {

						shutdown('shutdown');
					}
				} else if(command.search('перезагрузи комп') != -1 || command.search('перезагрузка компа') != -1) {

					bot.sendMessage(chatId, 'Перезагружаю компьютер!');
					if(command.search('через') !== -1) {

						const timeout = command.match(/\d+/);
						reboot('shutdown', timeout[0]);
					} else {

						reboot('shutdown');
					}
				} else if(command.search('открой браузер') != -1 || command.search('браузер') != -1 ) {
					bot.sendMessage(chatId, 'Открываю браузер!');

					open.openApp();
				} else if(command.search('открой вк') != -1 || command.search('вк') != -1 || command.search('вконтакте') != -1) {
					bot.sendMessage(chatId, 'Открываю вк!');

					open.openSite('vk');
				} else if(command.search('открой ютуб') != -1 || command.search('ютуб') != -1 || command.search('открой youtube') != -1 || command.search('youtube') != -1) {
					bot.sendMessage(chatId, 'Открываю ютуб!');

					open.openSite('youtube');
				}  else if(command.search('открой стим') != -1 || command.search('стим') != -1 ) {
					bot.sendMessage(chatId, 'Открываю стим!');

					open.openSteam();
				} else if(command.search('открой дискорд') != -1 || command.search('дискорд') != -1 ) {
					bot.sendMessage(chatId, 'Открываю дискорд!');

					open.openDiscord();
				} else {
					bot.sendMessage(chatId, `Такой команды нет ${CRY}`);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	});
});

function shutdown (shutdownCmd, timeout) {
	let args = ['-s'];
	if (timeout) {
		args.push('-t');
		args.push(parseInt(timeout, 10));
	}
	return spawn(shutdownCmd, args);
}

function reboot (shutdownCmd, timeout) {
	let args = ['-r'];
	if (timeout) {
		args.push('-t');
		args.push(parseInt(timeout, 10));
	}
	return spawn(shutdownCmd, args);
}

