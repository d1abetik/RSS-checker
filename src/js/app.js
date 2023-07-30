import * as yup from 'yup';
import view from './view';
import i18next from 'i18next';
import axios from 'axios';
import parserXml from './parser.js';
import { uniqueId } from 'lodash';
import onChange from 'on-change';

const validateUrl = (url, urls) => {
  const schema = yup.string().required().url().notOneOf(urls);
  return schema.validate(url);
};

const proxifyUrl = (url) => {
  const newUrl = new URL('https://allorigins.hexlet.app');
  newUrl.pathname = '/get';
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', url);
  return newUrl;
};

const updatePosts = (state) => {
  
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
          "success": "RSS успешно сформирован",
          "button": "Отправить",
          "feeds": "Фиды",
        }
      }
    }
  }).then(() => {
    const state = {
      form: {
        processState: null,
        error: null,
      },
      feeds: [],
      cards: [],
      viewedId: [],
      formId: '',
    }
  
  
    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('[id="url-input"]'),
      submit: document.querySelector('[aria-label="add"]'),
      feedbackEl: document.querySelector('.feedback'),
      postsContainer: document.querySelector('.posts'),
      feedsContainer: document.querySelector('.feeds'),
    }
    
    const watchedState = onChange(state, view(elements, state, instance));
  
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const existUrls = watchedState.feeds.map(({ url }) => url);
      const formData = new FormData(e.target);
      const url = formData.get('url');
      watchedState.form.error = null;
  
      validateUrl(url, existUrls)
        .then((url) => {
          watchedState.form.processState = 'sending';
          axios.get(proxifyUrl(url)).then((data) => {
            const tree = parserXml(data.data.contents);
            const { feeds, posts } = tree;
            const feedId = uniqueId();
            watchedState.feeds.push({ url, feedId, ...feeds });
            watchedState.cards.push(...posts.map((post) => ({ feedId, ...post })));
            watchedState.form.processState = 'success';
          }).catch((error) => {
            watchedState.form.error = new Error('err_invalidRss');
            console.log(error);
            watchedState.form.processState = 'error';
          });
        }).catch((err) => {
          watchedState.form.error = err;
          watchedState.form.processState = 'error';
          return;
      });
      elements.postsContainer.addEventListener('click', (e) => {
        if (e.target.dataset.id) {
          const { id } = e.target.dataset;
          watchedState.viewedId.push(id);
          watchedState.formId = id;
        }
      })
    });
  }).catch((errorState) => {
    console.log(errorState);
    watchedState.form.processState = 'error';
  });
};