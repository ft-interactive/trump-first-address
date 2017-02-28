/* eslint max-len: "off", prefer-rest-params: "off" */
/* global ga */

import MarkdownIt from 'markdown-it';
import * as expander from 'o-expander'; // eslint-disable-line

class Annotation {
  constructor(rootElement, options) {
    this.rootElement = rootElement;
    this.options = this.defaultOptions(options);
    this.highlightAttribute = 'data-highlight';
    this.highlightElements;
    this.annotations;
    this.selectedHighlight;
    this.annotationModals = {};

    // get rid of smart quotes — to fix matching bug
    this.rootElement.innerHTML = this.rootElement.innerHTML.replace(/‘/g, "'").replace(/’/g, "'").replace(/“/g, "\"").replace(/”/g, "\"");

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
      // this.annotations.map(annotation => annotation.match = annotation.match.replace(/'/g, "’").replace(/"/g, "”"))
      this.addHighlighting(data.annotations);
      this.appendAnnotation(this.annotations);
      this.updateAnnotations();
    }).catch(error => {
      console.error(error);
    });
  }

  updateAnnotations() {
    setTimeout(() => {
      // console.log('checking for updates');
      fetch(`https://bertha.ig.ft.com/view/publish/gss/${this.options.annotationsId}/authors,annotations`)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      }).then(data => {
        let newAnnotations = data.annotations.filter((el) => this.annotations.map(d => d.match.replace(/‘/g, "'").replace(/’/g, "'").replace(/“/g, "\"").replace(/”/g, "\"")).indexOf(el.match.replace(/‘/g, "'").replace(/’/g, "'").replace(/“/g, "\"").replace(/”/g, "\"")) < 0);
        // console.log(newAnnotations);
        this.addHighlighting(newAnnotations);
        this.annotations = this.annotations.concat(newAnnotations);
        this.appendAnnotation(newAnnotations);
      }).catch(error => {
        console.error(error);
      });
      this.updateAnnotations();
    }, 5000);
  }

  addHighlighting(annotations) {
    annotations.forEach((annotation, index) => {
      annotation.match = annotation.match.replace(/‘/g, "'").replace(/’/g, "'").replace(/“/g, "\"").replace(/”/g, "\"");
      if (this.elementContainingAnnotationMatcher(annotation.match) && annotation.annotation.md) {
        let annotationIndex = index;
        if (annotations.length !== this.annotations.length) {
          annotationIndex = index + this.annotations.length;
        }
        this.highlightMarkup(this.elementContainingAnnotationMatcher(annotation.match), annotation.match, annotationIndex);
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
      let annotationIndex = i;
      if (this.annotations.length - annotations.length !== 0) {
        annotationIndex = this.annotations.length - annotations.length + i;
      }
      const id = `annotation-${annotationIndex}`;
      this.annotationModals[id] = {};
      this.annotationModals[id] = document.createElement('aside');
      this.annotationModals[id].setAttribute('aria-live', 'polite');
      this.annotationModals[id].classList.add('speech__annotation');
      this.annotationModals[id].setAttribute('data-highlight-attribute', annotationIndex);

      this.rootElement.appendChild(this.annotationModals[id]);

      const highlight = document.querySelector(`mark[data-highlight="${annotationIndex}"]`);
      this.openAnnotation(highlight);
      highlight.setAttribute('aria-expanded', 'true');
    });

    expander.init(null, {});
  }

  openAnnotation(clickedElement) {
    const annotationIndex = clickedElement.getAttribute(this.highlightAttribute);
    const id = `annotation-${annotationIndex}`;

    this.annotationModals[id].innerHTML = this.generateAnnotationMarkup(this.annotations[annotationIndex]);

    this.annotationModals[id].style.top = `${this.calculateAnnotationYPosition(clickedElement, this.annotationModals[id]).top}px`;


    this.annotationModals[id].style.left = `${this.calculateAnnotationYPosition(clickedElement, this.annotationModals[id]).left}px`;

    this.annotationModals[id].style.visibility = 'visible';

    this.annotationModals[id].classList.add('o-expander');
    this.annotationModals[id].setAttribute('data-o-component', 'o-expander');
    this.annotationModals[id].setAttribute('data-o-expander-shrink-to', '1');
    this.annotationModals[id].setAttribute('data-o-expander-count-selector', 'p');
    this.annotationModals[id].setAttribute('data-o-expander-expanded-toggle-text', 'Read less');
    this.annotationModals[id].setAttribute('data-o-expander-collapsed-toggle-text', 'Read more');

    clickedElement.parentNode.insertBefore(this.annotationModals[id], clickedElement.nextSibling);
  }

  generateAnnotationMarkup(data) {
    const md = new MarkdownIt();
    const annotationLabel = `<span class="n-skip-link">Annotation by ${data.author}</span>`;

    let authorLink = data.author && data.authorlink ? `<a href="${data.authorlink}" rel="author" class="speech__annotation-byline">${data.author}</a>` : '';

    if (authorLink === '' && data.author) {
      authorLink = `<span class="speech__annotation-byline">${data.author}</span>`;
    }

    const oExpanderButton = '<button class="o-buttons o-buttons--small o-expander__toggle o--if-js">Read more</button>';

    return `${annotationLabel} <div class="o-expander__content"> ${md.render(data.annotation.md)} </div> ${oExpanderButton} ${authorLink}`;
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
