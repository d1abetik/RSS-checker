const renderErrors = (elements, error) => {
  elements.input.classList.add('is-invalid');
  elements.feedbackEl.classList.remove('text-success');
  elements.feedbackEl.classList.add('text-danger');
  elements.feedbackEl.textContent = error;
};

const renderSuccessMessage = () => {
  elements.input.classList.remove('is-invalid');
  elements.feedbackEl.classList.remove('text-danger');
  elements.feedbackEl.classList.add('text-success');
  elements.feedbackEl.textContent('RSS успешно загружен');
};

const clearFeedback = (elements) => {
  elements.input.classList.remove('is-invalid');
  elements.input.classList.remove('is-valid');

  elements.feedbackEl.classList.remvoe('text-danger');
  elements.feedbackEl.classList.remvoe('text-success');
  elements.feedbackEl.textContent = '';
};

export const renderFeedback = (elements, state, error) => {
  if (state.form.processState === 'sending') {
    clearFeedback(elements);
    return;
  }
  if (!error) {
    renderSuccessMessage(elements);
    return;
  }
  renderErrors(elements, error);
};
