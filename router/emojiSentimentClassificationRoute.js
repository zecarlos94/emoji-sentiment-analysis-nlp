const Sentiment = require("sentiment");
const Router = require('koa-router');
const BodyParser = require('koa-body');
const utils = require('../utils/utils');
const emojiList = require('../Emojis/emojis');

const sentiment = new Sentiment();

const router = new Router({
    prefix: '/classify'
});

var parsedEmojis = JSON.parse(JSON.stringify(emojiList));
var emojiMapper = new Map();

parsedEmojis.forEach(element => {
    emojiMapper.set(Object.keys(element)[0], Object.values(element)[0]);
});

router.get('/emoji-description/:emojiIcon', getEmojiDescription);
router.get('/emoji-description', classifyEmoji);

async function getEmojiDescription(ctx, next) {
    var correspondingEmoji = emojiMapper.get(ctx.params.emojiIcon);
    ctx.body = correspondingEmoji;
}

async function classifyEmoji(ctx, next) {
    var executionStatus = 'failed';
    var utteranceToClassify = ctx.query.utterance;
    
    if (utteranceToClassify != null){
        const sentimentAnalysisResult = sentiment.analyze(utteranceToClassify);
        executionStatus = 'success'; 

        const isNegative = utils.Any(sentimentAnalysisResult.negative);
        const isPositive = utils.Any(sentimentAnalysisResult.positive);
        const isNeutral  = !isNegative && !isPositive;
        const result = isPositive ? 'Positive' : (isNegative ? 'Negative' : (isNeutral ? 'Neutral' : 'Unknown'));

        ctx.body = {
            status: executionStatus,
            result: result,
            isPositive: isPositive,
            isNegative: isNegative,
            isNeutral: isNeutral,
            classification: sentimentAnalysisResult
        };
    }
    else{
        ctx.body = {
            status: executionStatus
        };
    }
}

module.exports = router;