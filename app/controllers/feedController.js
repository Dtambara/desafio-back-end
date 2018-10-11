const Parser = require('rss-parser');

const parser = new Parser();

module.exports = {
  async feed(req, res, next) {
    try {
      const feed = await parser.parseURL(
        'https://revistaautoesporte.globo.com/rss/ultimas/feed.xml',
      );

      return res.json({ feed });
    } catch (err) {
      return res.json({ err });
    }
  },
};
