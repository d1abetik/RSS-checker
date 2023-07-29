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
  const itemElem = feeds.map(({ title, description }) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3Li = document.createElement('h3')
    h3Li.classList.add('h6', 'm-0');
    const p = document.createElement('p')
    p.classList.add('m-0', 'small', 'text-black-50');
    
    h3Li.textContent = title;
    p.textContent = description;
    li.append(p, h3Li);
  });
  return itemElem;
};

const renderList = (list) => {
  const itemEl = list.map(({ title, link, feedId }) => {
    const li = document.createElement('li') // нужен фикс
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a')
    a.classList.add('fw-bold');
    a.setAttribute('href', `${link}`);
    a.setAttribute('data-id', `${feedId}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;

    const button = document.createElement('button')
    button.classList.add('fw-normal');
    button.setAttribute('href', `${link}`);
    button.setAttribute('data-id', `${id}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Отправить';
    
    li.append(a, button);
  });

  return itemEl
};

export const renderCard = (elements, state, value, inst, path) => {
  if (value.length === 0) {
    return;
  }

  if (path === 'feeds') {
    const feeds = renderFeed(state.feeds);
    const divFeed = document.createElement('div')
    divFeed.classList.add('card', 'border-0');
    const divFeedBody = document.createElement('div')
    divFeedBody.classList.add('card-title', 'h4')
    divFeedBody.textContent = 'Фиды';
    const ul = document.createElement('ul')
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    ul.append(feeds);
    divFeedBody.append(ul);
    divFeed.append(divFeedBody);
    elements.feedsContainer.append(divFeed);
  } else {
    console.log('stateCards', state.cards)
    const cards = renderList(state.cards);
    const divCard = document.createElement('div').classList.add('card', 'border-0');
    const cardBody = document.createElement('div').classList.add('card-body');
    const h2 = document.createElement('h2')
    h2.className = 'card-title h4';
    const ulCards = document.createElement('ul').classList.add('list-group', 'border-0', 'rounded-0');
  
    console.log(cards)
    ulCards.append(cards);
    cardBody.append(ulCards);
    divCard.append(cardBody);
    elements.postsContainer.append(divCard);
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
