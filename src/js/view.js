import onChange from 'on-change';
import { renderFeedback, renderCard } from './render.js';

export default (elements, state, inst) => {
  const handleProcessState = (processState) => {
    switch (processState) {
      case 'error':
        renderFeedback(elements, state, state.form.error, inst);
        elements.input.disabled = false;
        elements.submit.disabled = false;
        elements.input.focus();
        break;
        
      case 'sending':
        renderFeedback(elements, state, state.form.error, inst);
        elements.submit.disabled = true;
        elements.input.disabled = true;
        watchedState.form.processState = 'success';
        break;
        
      case 'success':
          renderFeedback(elements, state, state.form.error, inst);
          elements.input.disabled = false;
          elements.submit.disabled = false;
          elements.form.reset();
          elements.input.focus();
          break;
      default:
        throw new Error('Unknown process');
    }
  };
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        handleProcessState(value);
        break;
      case 'feeds':
        renderCard(elements, state, value, inst);
      case 'cards':
        renderCard(elements, state, value, inst);
      default:
        break;
    }
  });
  return watchedState;
};