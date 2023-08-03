const renderErrors = (elements, error, inst) => {
  elements.input.classList.add('is-invalid');
  elements.feedbackEl.classList.remove('text-success');
  elements.feedbackEl.classList.add('text-danger');
  elements.feedbackEl.textContent = inst.t(error.message);
};

const renderSuccess = (elements, inst) => {
  elements.input.classList.remove('is-invalid');
  elements.feedbackEl.classList.remove('text-danger');
  elements.feedbackEl.classList.add('text-success');
  elements.feedbackEl.textContent = inst.t('success');
};

const clearFeedback = (elements) => {
  elements.input.classList.remove('is-valid');
  elements.input.classList.remove('is-invalid');
  elements.feedbackEl.classList.remove('text-danger');
  elements.feedbackEl.classList.remove('text-success');
  elements.feedbackEl.textContent = '';
};

const renderFeed = (feeds) => {
  const itemElem = feeds.map(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3Li = document.createElement('h3');
    h3Li.classList.add('h6', 'm-0');
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');

    h3Li.textContent = title;
    p.textContent = description;
    li.append(h3Li, p);
    return li;
  });
  return itemElem;
};

const renderList = (list, inst, state) => {
  const itemEl = list.map(({ modalId, title, link }) => {
    const data = state.visitedLinksIds.find((item) => item === modalId);
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.setAttribute('data-id', modalId);
    if (data) {
      a.className = 'fw-normal link-secondary';
    } else {
      a.className = 'fw-bold';
    }
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('href', link);
    button.setAttribute('data-id', modalId);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = inst.t('button');

    li.append(a, button);
    return li;
  });

  return itemEl;
};

export const renderContainer = (elements, state, value, inst, path) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const divMain = document.createElement('div');
  divMain.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  if (path === 'feeds') {
    elements.feedsContainer.textContent = '';
    const utils = renderFeed(value, inst);

    const divFeedBody = document.createElement('div');
    divFeedBody.classList.add('card-title', 'h4');
    divFeedBody.textContent = inst.t('feeds');

    utils.map((feed) => {
      ul.append(feed);
      return null;
    });

    divFeedBody.append(ul);
    divMain.append(divFeedBody);
    elements.feedsContainer.textContent = '';
    elements.feedsContainer.prepend(divMain);
  } else {
    elements.postsContainer.textContent = '';
    const utils = renderList(state.cards, inst, state);
    const h2 = document.createElement('h2');
    h2.className = 'card-title h4';

    utils.map((card) => {
      ul.append(card);
      return null;
    });

    cardBody.append(ul);
    divMain.append(cardBody);
    elements.postsContainer.textContent = '';
    elements.postsContainer.prepend(divMain);
  }
};

const renderModal = (elements, state, value) => {
  const titleById = document.querySelector(`a[data-id="${value}"]`);
  titleById.className = 'fw-normal link-secondary';
  const data = state.cards.find((item) => item.modalId === value);
  elements.modal.title.textContent = data.title;
  elements.modal.body.textContent = data.description;
  elements.modal.button.setAttribute('href', data.link);
};

const handleProcessState = (elements, state, inst, value) => {
  switch (value) {
    case 'filling':
      break;
    case 'error':
      renderErrors(elements, state.form.error, inst);
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;
    case 'sending':
      clearFeedback(elements);
      elements.submit.disabled = true;
      elements.input.disabled = true;
      break;
    case 'success':
      renderSuccess(elements, inst);
      elements.form.reset();
      elements.input.focus();
      elements.submit.disabled = false;
      elements.input.disabled = false;
      break;
    default:
      throw new Error(`Unknown process state: ${value}`);
  }
};

export default (elements, state, inst) => (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, state, inst, value);
      break;
    case 'feeds':
      renderContainer(elements, state, value, inst, path);
      break;
    case 'cards':
      renderContainer(elements, state, value, inst, path);
      break;
    case 'modalId':
      renderModal(elements, state, value);
      break;
    case 'visitedLinksIds':
      renderContainer(elements, state, value, inst, path);
      break;
    default:
      break;
  }
};
