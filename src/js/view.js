import { renderFeedback, renderContainer } from './render.js';

export default (elements, state, inst) => (path, value) => {
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
  const render = () => {
    switch (path) {
      case 'form.processState':
        handleProcessState(value);
        break;
      case 'feeds':
      case 'cards':
        renderContainer(elements, state, value, inst, path);
        break;
      default:
        break;
    }
  };
  return render();
};