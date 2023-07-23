import onChange from 'on-change';
import { renderFeedback } from './render.js';

export default (elements, state) => {
  const handleProcessState = (processState) => {
    switch (processState) {
      case 'error':
        renderFeedback(elements, state, state.form.error);
        elements.input.disabled = false;
        elements.submit.disabled = false;
        elements.input.focus();
        break;

      case 'sending':
        renderFeedback(elements, state, state.form.error);
        elements.submit.disabled = true;
        elements.input.disabled = true;
        break;

      case 'success':
        renderFeedback(elements, state, state.form.error);
        elements.input.disabled = false;
        elements.submit.disabled = false;
        elements.form.reset();
        elements.input.focus();
        break;

      default:
        throw new Error(`Unknown process ${process}`);
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        handleProcessState(value);
        break;
      default:
        break;
    }
  });
  return watchedState;
};