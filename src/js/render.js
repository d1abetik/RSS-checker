const renderErrors = (elements, error, inst) => {
  elements.input.classList.add('is-invalid');
  elements.feedbackEl.classList.remove('text-success');
  elements.feedbackEl.classList.add('text-danger');
  elements.feedbackEl.textContent = inst.t(error.message);
};

const renderSuccessMessage = (elements, inst) => {
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
  const itemElem = feeds.map(({ url, feedId, title, description }) => {
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

const renderList = (list, inst) => {
  const itemEl = list.map(({ feedId, title, description, link }) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a')
    a.classList.add('fw-normal');
    a.setAttribute('href', link);
    a.setAttribute('data-id', feedId);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;

    const button = document.createElement('button')
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('href', link);
    button.setAttribute('data-id', feedId);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = inst.t("button");
    
    li.append(a, button);
    return li;
  });

  return itemEl;
};

export const renderContainer = (elements, state, value, inst, path) => {
  const ul = document.createElement('ul')
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const divMain = document.createElement('div');
  divMain.classList.add('card', 'border-0');

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body');

  if (path === 'feeds') {
    const feeds = renderFeed(value, inst);

    const divFeedBody = document.createElement('div');
    divFeedBody.classList.add('card-title', 'h4');
    divFeedBody.textContent = inst.t('feeds');

    feeds.map((feed) => {
      ul.append(feed);
    });

    divFeedBody.append(ul);
    divMain.append(divFeedBody);
    elements.feedsContainer.textContent = '';
    elements.feedsContainer.append(divMain);
  } else {
    const cards = renderList(state.cards, inst);
    const h2 = document.createElement('h2')
    h2.className = 'card-title h4';
  
    cards.map((card) => {
      ul.append(card);
    });

    cardBody.append(ul);
    divMain.append(cardBody);
    elements.postsContainer.textContent = '';
    elements.postsContainer.append(divMain);
  }
};

export const renderFeedback = (elements, state, error, inst) => {
  if (state.form.processState === 'sending') {
    clearFeedback(elements);
    return;
  }
  if (!error) { 
    renderSuccessMessage(elements, inst);
    return;
  }
  renderErrors(elements, error, inst);
};
