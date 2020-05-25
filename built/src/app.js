"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var pixiv_app_api_1 = __importDefault(require("pixiv-app-api"));
var pixiv_img_1 = __importDefault(require("pixiv-img"));
var datefns = __importStar(require("date-fns"));
var HChannelId = '547540063584518144';
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.run = function () {
        var _this = this;
        var client = new discord_js_1.Client();
        client.once('ready', function () {
            var channel = client.channels.cache.get(HChannelId);
            channel.send('搬运开始了');
            _this.setupScheduledSent(client);
        });
        client.on('message', function (message) {
            switch (message.content) {
                case '!pic':
                    _this.sendRandom(client);
            }
        });
        client.login(process.env.DISCORD_BOT_TOKEN);
    };
    App.prototype.sendR18Img = function (client, mode, index) {
        var channel = client.channels.cache.get(HChannelId);
        var pix = new pixiv_app_api_1.default();
        pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD).then(function () {
            pix.illustRanking({ mode: mode || 'week_r18' }).then(function (json) {
                var illusts = json.illusts;
                var randomIndex = datefns.getDay(new Date()) % 30;
                pixiv_img_1.default(illusts[index || randomIndex].imageUrls.large, './r18.png').then(function () {
                    channel.send({ files: ['./r18.png'] });
                });
            });
        });
    };
    App.prototype.sendRandom = function (client) {
        this.sendR18Img(client, 'month', Math.floor(Math.random() * 30));
    };
    App.prototype.setupScheduledSent = function (client, timePeriod) {
        var _this = this;
        var DayInMilliseconds = 1000 * 60 * 60 * 24;
        client.setInterval(function () {
            var channel = client.channels.cache.get(HChannelId);
            channel.send('每日任务？');
            _this.sendR18Img(client);
        }, timePeriod || DayInMilliseconds);
    };
    return App;
}());
exports.default = App;
