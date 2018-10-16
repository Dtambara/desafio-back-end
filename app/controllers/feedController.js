const Parser = require('rss-parser');
const himalaya = require('himalaya');

const parser = new Parser();

function procuraLinksNosElementos(element) {
  element.children.map((child) => {
    if (child.tagName === 'li') {
      procuraLinksNosElementos(child);
    } else if (child.tagName === 'a') {
      child.attributes.map((attribute) => {
        if (attribute.key === 'href') {
          const arrayLinks = [];
          arrayLinks.push(attribute.value);
          return arrayLinks;
        }
      });
    }
  });
  return [];
}

function montaDescricaoTexto(item, child) {
  const descriptionObjectText = {};
  descriptionObjectText.type = 'text';
  descriptionObjectText.content = child.children[0].content;
  item.description.push(descriptionObjectText);
}

function montaDescricaoImagem(element, item) {
  const descriptionObjectDiv = {};
  descriptionObjectDiv.type = 'image';
  element.attributes.map((attribute) => {
    if (attribute.key === 'src') {
      descriptionObjectDiv.content = attribute.value;
    }
  });
  item.description.push(descriptionObjectDiv);
}

function montaDescricaoLinks(element, item) {
  const descriptionObjectDiv = {};
  descriptionObjectDiv.type = 'links';
  descriptionObjectDiv.content = procuraLinksNosElementos(element);
  item.description.push(descriptionObjectDiv);
}

function formataPeloTipoDescricao(item, child) {
  if (child.tagName === 'p') {
    montaDescricaoTexto(item, child);
  } else if (child.tagName === 'div') {
    child.children.map((element) => {
      if (element.tagName === 'img') {
        montaDescricaoImagem(element, item);
      } else if (element.tagName === 'ul') {
        montaDescricaoLinks(element, item);
      }
    });
  }
}

function formataDescription(itemResponseDescriptionJson, item) {
  itemResponseDescriptionJson.map((child) => {
    formataPeloTipoDescricao(item, child);
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
