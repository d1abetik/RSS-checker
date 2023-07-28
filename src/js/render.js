import { main } from "@popperjs/core";

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
    .classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3Li = docuement.createElement('h3')
    .classList.add('h6', 'm-0');
    const p = document.createElement('p')
    .classList.add('m-0', 'small', 'text-black-50');
    
    h3Li.textContent = title;
    p.textContent = description;
    return li;
  });
  li.append(h3Li, p);
  ul.append(li);
  divFeedBody.append(ul);
  divFeed.append(divFeedBody);
  mainDiv.append(divFeed);
};

const renderList = (state, inst, list) => {
  const liCards = document.createElement('li').classList.add('list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  
  const itemEl = list.map(({ title, link, id }) => {
    const a = document.createElement('a')
    .classList.add('fw-bold');
    a.setAttribute('href', `${link}`);
    a.setAttribute('data-id', `${id}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;
    
    const button = document.createElement('button')
    .classList.add('fw-normal');
    button.setAttribute('href', `${link}`);
    button.setAttribute('data-id', `${id}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = inst.t('postButton');
    
    li.append(a, button);
  })
};

export const renderCard = (elements, state, value, inst) => {
  if (value.length === 0) {
    return;
  }

  const cards = renderList();
  const feeds = renderFeed(state.feeds);

  const mainDiv = document.createElement('div')
    .classList.add('col-md-10', 'col-lg-4', 'mx-auto', 'order-0', 'order-lg-1', 'feeds');
  const divFeed = document.createElement('div')
    .classList.add('card', 'border-0');
  const divFeedBody = document.createElement('div')
    .classList.add('card-title', 'h4')
    .textContent = 'Фиды';
  const ul = document.createElement('ul')
    .classList.add('list-group', 'border-0', 'rounded-0');
  
  const divCards = document.createElement('div').classList.add('col-md-10', 'col-lg-8', 'order-1', 'mx-auto', 'posts');
  const divCard = document.createElement('div').classList.add('card', 'border-0');
  const cardBody = document.createElement('div').classList.add('card-body');
  const h2 = document.createElement('h2')
  h2.className = 'card-title h4';
  const ulCards = document.createElement('ul').classList.add('list-group border-0 rounded-0');
  
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
