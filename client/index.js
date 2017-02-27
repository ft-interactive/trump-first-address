import annotations from './components/annotations';
import * as expander from 'o-expander'; // eslint-disable-line

annotations.init('[data-annotation-text]', {
  minWidth: 200,
  maxWidth: 400,
  gutter: 40,
});

const int = setInterval(() => {
  if (document.querySelectorAll('aside.speech__annotation').length) {
    expander.init(null, {});
    clearInterval(int);
  }
}, 200);
