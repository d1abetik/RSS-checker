import * as yup from 'yup';
import view from './view';
// import { isEqual, uniqueId } from 'lodash';

const validateUrl = (url, urls) => {
  const schema = yup.string().required().url().notOneOf(urls);

  return schema.validate(url)
    .then(() => '')
    .catch((error) => error);
};

export default app = () => {
  const state = {
    form: {
      processState: 'finished',
      error: null,
    },
    feeds: [],
  }

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('[type=url-input]'),
    submit: document.querySelector('[aria-label=add]'),
    feedbackEl: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  }
  
  const watchedState = view(elements, initialState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const existUrls = watchedState.feeds.map(({ url }) => url);
    const url = formData.get('url').trim();

    validateUrl(url, existUrls)
    .then((validationError) => {
      watchedState.form.processState = 'sending';

      if (validationError) {
        watchedState.form.error = validationError;
        watchedState.form.processState = 'error';
        return;
      }
    });
    watchedState.run = 'filling';
    watchedState.values.push({ url: e.target.value, status: 'invisible' });
  });
  render(state);
};