const Parser = require('rss-parser');
const himalaya = require('himalaya');

const parser = new Parser();

function procuraLinksNosElementos(element, ...arrayLinks) {
  element.children.map((child) => {
    if (child.tagName === 'li') {
      procuraLinksNosElementos(child);
    } else if (child.tagName === 'a') {
      child.attributes.map((attribute) => {
        if (attribute.key === 'href') {
          arrayLinks.push(attribute.value);
        }
      });
    }
  });
}

function formataDescription(itemResponseDescriptionJson, item) {
  itemResponseDescriptionJson.map((child) => {
    if (child.tagName === 'p') {
      const descriptionObjectText = {};
      descriptionObjectText.type = 'text';
      descriptionObjectText.content = child.children[0].content;
      item.description.push(descriptionObjectText);
    } else if (child.tagName === 'div') {
      child.children.map((element) => {
        if (element.tagName === 'img') {
          const descriptionObjectDiv = {};
          descriptionObjectDiv.type = 'image';
          element.attributes.map((attribute) => {
            if (attribute.key === 'src') {
              descriptionObjectDiv.content = attribute.value;
            }
          });
          item.description.push(descriptionObjectDiv);
        } else if (element.tagName === 'ul') {
          const descriptionObjectDiv = {};
          descriptionObjectDiv.type = 'links';
          descriptionObjectDiv.content = [];
          procuraLinksNosElementos(element, descriptionObjectDiv.content);
          console.log(descriptionObjectDiv.content);
          item.description.push(descriptionObjectDiv);
        }
      });
    }
  });
}

module.exports = {
  async feed(req, res, next) {
    try {
      const response = await parser.parseURL(
        'https://revistaautoesporte.globo.com/rss/ultimas/feed.xml',
      );

      const feed = [];

      response.items.map((itemResponse) => {
        const item = {};
        item.title = itemResponse.title;
        item.link = itemResponse.link;
        item.description = [];
        const itemResponseDescriptionJson = himalaya.parse(itemResponse.content);
        formataDescription(itemResponseDescriptionJson, item);
        feed.push(item);
      });
      return res.json({ feed });
    } catch (err) {
      console.log(err);
      return res.send();
    }
  },
};
