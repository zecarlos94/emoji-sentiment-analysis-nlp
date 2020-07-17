const Koa = require('koa');
const Logger = require('koa-logger');
const emojiSentimentClassificationRoutes = require('./router/emojiSentimentClassificationRoute');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(new Logger());
app.use(emojiSentimentClassificationRoutes.routes());
app.use(emojiSentimentClassificationRoutes.allowedMethods());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
  
module.exports = server;