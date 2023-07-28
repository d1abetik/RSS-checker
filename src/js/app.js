import * as yup from 'yup';
import view from './view';
import i18next from 'i18next';
import axios from 'axios';
import parserXml from './parser.js';
import { uniqueId } from 'lodash';

const validateUrl = (url, urls) => {
  
  const schema = yup.string().url().required().notOneOf(urls);
  return schema.validate(url);
};

export default () => {
  yup.setLocale({
    string: {
      url: 'err_invalidUrl',
    },
    mixed: {
      notOneOf: 'err_existRss',
      required: 'err_emptyFiled'
    }
  });
  const defLng = 'ru'
  const instance = i18next.createInstance();
  instance.init({
    lng: defLng,
    resources: {
      ru: {
        translation: {
          "err_emptyFiled": "Поле должно быть заполненым",
          "err_invalidUrl": "Ссылка должна быть валидной",
          "err_existRss": "RSS уже существует",
          "success": "RSS успешно сформирован"
        }
      }
    }
  });

  const state = {
    form: {
      processState: null,
      error: null,
    },
    feeds: [],
    cards: [],
  }

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('[id="url-input"]'),
    submit: document.querySelector('[aria-label="add"]'),
    feedbackEl: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  }
  
  const watchedState = view(elements, state, instance);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const existUrls = state.feeds.map((url) => url);
    const url = formData.get('url');
    watchedState.form.error = '';

    validateUrl(url, existUrls)
      .then((url) => {
        // watchedState.feeds.push(url);
        const proxifyUrl = (url) => {
          const newUrl = new URL('https://allorigins.hexlet.app');
          newUrl.pathname = '/get';
          newUrl.searchParams.set('disableCache', 'true');
          newUrl.searchParams.set('url', url);
          return newUrl;
        };
        axios.get(proxifyUrl(url))
        .then(data => {
          const tree = parserXml(data.data.contents);
          console.log(tree);
          const title = tree.querySelector('title');
          const description = tree.querySelector('description');
          const url = tree.querySelector('link');
          const feedId = uniqueId();
          watchedState.feeds.push({ title, description, feedId, url });
          const items = tree.querySelectorAll('item');
          items.forEach((item) => {
            const titleCard = item.querySelector('title');
            const link = item.querySelector('link');
            watchedState.cards.push({ titleCard, link, feedId });
          });
        });
        watchedState.form.processState = 'sending';
      return;
    }).catch((err) => {
      watchedState.form.error = err;
      watchedState.form.processState = 'error';
    });
  });
};