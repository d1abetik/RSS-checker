import * as yup from 'yup';
import view from './view';
import i18next from 'i18next';
import axios from 'axios';
import parserXml from './parser.js';
import { uniqueId, isEqual, some } from 'lodash';
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
  const urls = state.feeds.map(({ url }) => url )
  const linksOld = state.cards.map(({ link }) => link);
  const request = urls.map((currentUrl) => axios.get(proxifyUrl(currentUrl))
    .then((response) => {
      const { feedId } = urls.find((ur) => ur === currentUrl);
      const { posts } = parserXml(response.data.contents);
      const links = posts.filter(({ link }) => !linksOld.some((item) => isEqual(item, link)));
      console.log(links)
      const ps = links.map((post) => ({
        feedId,
        postId: uniqueId(),
        ...post,
      }))
      state.cards.push(...ps);
    }).catch((err) => console.log(err)));
  Promise.all(request)
    .finally(() => {
      setTimeout(() => updatePosts(state), 500);
    });
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
          "err_invalidRss": "Ресурс не содержит валидный RSS",
          "success": "RSS успешно сформирован",
          "button": "Просмотр",
          "feeds": "Фиды",
          "err_network": "Ошибка сети",
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
      visitedLinksIds: [],
      modalId: '',
    }
  
    const elements = {
      form: document.querySelector('form'),
      input: document.querySelector('input'),
      submit: document.querySelector('button[type="submit"]'),
      feedbackEl: document.querySelector('.feedback'),
      postsContainer: document.querySelector('.posts'),
      feedsContainer: document.querySelector('.feeds'),
      modal: {
        title: document.querySelector('.modal-title'),
        body: document.querySelector('.modal-body'),
        button: document.querySelector('a[role="button"]'),
      },
    }
    
    const watchedState = onChange(state, view(elements, state, instance));
  
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const existUrls = state.feeds.map(({ url }) => url);
      const formData = new FormData(e.target);
      const url = formData.get('url');
      watchedState.form.error = null;
      console.log(state, watchedState);
  
      validateUrl(url, existUrls)
        .then((url) => {
          watchedState.form.processState = 'sending';
          axios.get(proxifyUrl(url)).then((data) => {
            const tree = parserXml(data.data.contents);
            const { feeds, posts } = tree;
            const feedId = uniqueId();
            watchedState.feeds.push({ url, feedId, ...feeds });
            watchedState.cards.push(...posts.map((post) => ({ feedId, modalId: uniqueId(), ...post })));
            watchedState.form.processState = 'success';
          }).catch((error) => {
            if (error.isAxiosError) {
              watchedState.form.error = new Error('err_network');
            } if (error.isParseError) {
              watchedState.form.error = new Error('err_invalidRss');
            }
            console.log(error)
            watchedState.form.processState = 'error';
            return;
          });
        });
      elements.postsContainer.addEventListener('click', (e) => {
        if (e.target.dataset.id) {
          const { id } = e.target.dataset;
          watchedState.visitedLinksIds.push(id);
          watchedState.modalId = id;
        }
      })
    });
    updatePosts(watchedState);
  })
};