import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import annotations from './components/annotations';
//
// annotations.init('[data-annotation-text]', {
//   minWidth: 200,
//   maxWidth: 400,
//   gutter: 40,
// });

class Annotation extends Component {
  render() {
    const annotationText = 'Hello test';
    const authorName = 'Test';
    const authorLink = 'http://google.com';

    return <aside id="annotation" aria-hidden="false" aria-live="polite" class="speech__annotation" style="width: 100%; top: 271px; left: 669px; visibility: visible;"><p>{ annotationText }</p><a href="{ authorLink }" rel="author" class="speech__annotation-byline">{ authorName }</a></aside>;
  }
}

ReactDOM.render(<Annotation />, document.getElementById('speech-container'));
