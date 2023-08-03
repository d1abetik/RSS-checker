import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import { uniqueId, isEqual } from 'lodash';
import parserXml from './parser.js';
import view from './view.js';

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
  const urls = state.feeds.map(({ url }) => url);
  const linksOld = state.cards.map(({ link }) => link);
  const request = urls.map((currentUrl) => axios.get(proxifyUrl(currentUrl))
    .then((response) => {
      const { feedId } = urls.find((difUrl) => difUrl === currentUrl);
      const { posts } = parserXml(response.data.contents);
      const links = posts
        .filter(({ link }) => !linksOld.some((item) => isEqual(item, link)))
        .map((post) => ({
          feedId,
          postId: uniqueId(),
          ...post,
        }));
      state.cards.push(...links);
    }).catch((err) => console.log(err)));
  Promise.all(request)
    .finally(() => {
      setTimeout(() => updatePosts(state), 500);
    });
};

export default () => {
  yup.setLocale({
    string: {
      url: 'err_invalidUrl'
    },
    mixed: {
      notOneOf: 'err_existRss',
      required: 'err_emptyFiled'
    }
  });
  const defLng = 'ru';
  const instance = i18next.createInstance();
  instance.init({
    lng: defLng,
    resources: {
      ru: {
        translation: {
          err_emptyFiled: 'Поле должно быть заполненым',
          err_invalidUrl: 'Ссылка должна быть валидной',
          err_existRss: 'RSS уже существует',
          err_invalidRss: 'Ресурс не содержит валидный RSS',
          success: 'RSS успешно загружен',
          button: 'Просмотр',
          feeds: 'Фиды',
          err_network: 'Ошибка сети'
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
    };

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
    };

    const watchedState = onChange(state, view(elements, state, instance));

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const existUrls = state.feeds.map(({ url }) => url);
      const formData = new FormData(e.target);
      const nowUrl = formData.get('url');
      watchedState.form.error = null;

      validateUrl(nowUrl, existUrls)
        .then((url) => {
          watchedState.form.processState = 'sending';
          axios.get(proxifyUrl(url)).then((data) => {
            const tree = parserXml(data.data.contents);
            const { feeds, posts } = tree;
            const feedId = uniqueId();
            watchedState.feeds.push({ url, feedId, ...feeds });
            watchedState.cards.push(...posts.map((post) => ({
              feedId, modalId: uniqueId(), ...post
            })));
            watchedState.form.processState = 'success';
          }).catch((error) => {
            if (error.isAxiosError) {
              watchedState.form.error = new Error('err_network');
            } if (error.isParseError) {
              watchedState.form.error = new Error('err_invalidRss');
            }
            console.log(error);
            watchedState.form.processState = 'error';
            return;
          });
        });
      elements.postsContainer.addEventListener('click', (event) => {
        if (event.target.dataset.id) {
          const { id } = event.target.dataset;
          watchedState.visitedLinksIds.push(id);
          watchedState.modalId = id;
        }
      });
    });
    updatePosts(watchedState);
  });
};
