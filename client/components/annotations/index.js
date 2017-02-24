/* eslint max-len: "off", prefer-rest-params: "off" */
/* global ga */

import MarkdownIt from 'markdown-it';

class Annotation {
  constructor(rootElement, options) {
    this.rootElement = rootElement;
    this.options = this.defaultOptions(options);
    this.highlightAttribute = 'data-highlight';
    this.highlightElements;
    this.annotations;
    this.selectedHighlight;
    this.annotationModals = {};

    this.getAnnotations();
  }

  static init(rootElement, options = {}) {
    if (!rootElement) {
      rootElement = document.querySelectorAll('[data-annotation-text]');
    } else if (!(rootElement instanceof HTMLElement)) {
      rootElement = document.querySelectorAll(rootElement);
    }

    if (rootElement instanceof HTMLElement) {
      new Annotation(rootElement, options);
    } else {
      [].forEach.call(rootElement, (element) => {
        new Annotation(element, options);
      });
    }
  }

  defaultOptions(options) {
    return {
      annotationsId: options.annotationsId || this.rootElement.getAttribute('data-annotation-id'),
      minWidth: options.minWidth || null,
      maxWidth: options.maxWidth || null,
      gutter: options.gutter || null,
    };
  }

  getAnnotations() {
    fetch(`https://bertha.ig.ft.com/view/publish/gss/${this.options.annotationsId}/authors,annotations`)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then(data => {
      this.annotations = data.annotations;
      this.addHighlighting();
      this.appendAnnotation(this.annotations);
    }).catch(error => {
      console.error(error);
    });
  }

  addHighlighting() {
    this.annotations.forEach((annotation, index) => {
      if (this.elementContainingAnnotationMatcher(annotation.match) && annotation.annotation.md) {
        this.highlightMarkup(this.elementContainingAnnotationMatcher(annotation.match), annotation.match, index);
      }
    });
    this.highlightElements = this.rootElement.querySelectorAll(`[${this.highlightAttribute}]`);
  }

  highlightMarkup(node, matcher, annotationIndex) {
    const highlight = document.createElement('mark');
    highlight.innerHTML = matcher;
    highlight.tabIndex = 0;
    highlight.classList.add('speech__highlight');
    highlight.setAttribute(this.highlightAttribute, annotationIndex);
    highlight.setAttribute('aria-expanded', 'false');
    highlight.setAttribute('aria-controls', 'annotation');

    if (node.innerHTML) {
      node.innerHTML = node.innerHTML.replace(matcher, highlight.outerHTML);
    }
  }

  elementContainingAnnotationMatcher(matcher) {
    for (let i = 0; i < this.rootElement.childNodes.length; i++) {
      if (this.rootElement.childNodes[i].textContent.includes(matcher)) {
        return this.rootElement.childNodes[i];
        break;
      }
    }
  }

  appendAnnotation(annotations) {
    annotations.forEach((annotation, i) => {
      const id = `annotation-${i}`;
      this.annotationModals[id] = {};
      this.annotationModals[id] = document.createElement('aside');
      this.annotationModals[id].id = 'annotation';
      this.annotationModals[id].setAttribute('aria-hidden', true);
      this.annotationModals[id].setAttribute('aria-live', 'polite');
      this.annotationModals[id].classList.add('speech__annotation');

      this.rootElement.appendChild(this.annotationModals[id]);
    });

    [].forEach.call(this.highlightElements, (element) => {
      this.openAnnotation(element);
      element.setAttribute('aria-expanded', 'true');
    });
  }

  openAnnotation(clickedElement) {
    const annotationIndex = clickedElement.getAttribute(this.highlightAttribute);
    const id = `annotation-${annotationIndex}`;
    this.annotationModals[id].innerHTML = this.generateAnnotationMarkup(this.annotations[annotationIndex]);

    this.annotationModals[id].style.top = `${this.calculateAnnotationYPosition(clickedElement, this.annotationModals[id]).top}px`;


    this.annotationModals[id].style.left = `${this.calculateAnnotationYPosition(clickedElement, this.annotationModals[id]).left}px`;

    this.annotationModals[id].style.visibility = 'visible';

    this.annotationModals[id].setAttribute('aria-hidden', false);

    clickedElement.parentNode.insertBefore(this.annotationModals[id], clickedElement.nextSibling);
  }

  generateAnnotationMarkup(data) {
    const md = new MarkdownIt();
    // console.log(data);
    let authorLink = data.author && data.authorlink ? `<a href="${data.authorlink}" rel="author" class="speech__annotation-byline">${data.author}</a>` : '';

    if (authorLink === '' && data.author) {
      authorLink = `<span class="speech__annotation-byline">${data.author}</span>`;
    }

    return `${md.render(data.annotation.md)} ${authorLink}`;
  }

  calculateAnnotationYPosition(highlight, annotation) {
    if (highlight) {
      const topOfHighlight = highlight.offsetTop;
      const heightOfAnnotation = annotation.clientHeight;
      const bottomOfSpeech = this.rootElement.clientHeight + this.rootElement.offsetTop;
      const leftPosition = this.rootElement.clientWidth + this.options.gutter;

      return {
        top: topOfHighlight + heightOfAnnotation < bottomOfSpeech ? topOfHighlight : topOfHighlight - ((topOfHighlight + heightOfAnnotation) - bottomOfSpeech),
        left: leftPosition,
      };
    }
    return {};
  }
}

export default Annotation;
