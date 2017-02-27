/** @jsx preact.h */
import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';
import axios from 'axios';
import { h, render, Component } from 'preact';


function annotateSpeech(annotations) {
  let manipulatedHtml = speechBody.html;
  annotations.forEach((annotation) => {
    manipulatedHtml = manipulatedHtml.replace(annotation.match, `<mark class="annotation-highlight">${annotation.match}</mark>`)
  });

  return manipulatedHtml;
}

class Annotation extends Component {
  render() {
    const annotation_text = "Hello test";
    return <aside id="annotation" aria-hidden="false" aria-live="polite" class="speech__annotation" style="width: 100%; top: 271px; left: 669px; visibility: visible;"><p>{ annotation_text }</p><a href="{ author_link }" rel="author" class="speech__annotation-byline">{ author_name }</a></aside>;
  }
}

render(<Annotation />, document.getElementById('speech-container'));


export default async function() {
  const d = await article();
  const flags = await getFlags();
  const onwardJourney = await getOnwardJourney();

  let intro;
  let headline;
  let summary;
  let title;
  let description;
  let speech;
  let socialImage;
  let socialHeadline;
  let socialSummary;

  const berthaId = '1Cfrkjwn-_IdlDCW9xlLcueBRf6UTA5F-eE6OMKaAz90';
  const endpoint = `http://bertha.ig.ft.com/view/publish/gss/${berthaId}/authors,annotations,speech,pageText`;
  try {
    const res = await axios(endpoint);
    const pageText = res.data.pageText;
    intro = pageText.filter((d) => d.key === 'introText')[0].value;
    headline = pageText.filter((d) => d.key === 'headline')[0].value;
    summary = pageText.filter((d) => d.key === 'standfirst')[0].value;
    title = headline;
    description = summary;
    speech = res.data.speech[0].text;

    socialImage = pageText.filter((d) => d.key === 'socialImage')[0].value;
    socialHeadline = pageText.filter((d) => d.key === 'socialHeadline')[0].value;
    socialSummary = pageText.filter((d) => d.key === 'socialSummary')[0].value;
  } catch (e) {
    console.log('Error getting content from Bertha', e);
  }

  return {
    ...d,
    berthaId,
    intro,
    headline,
    summary,
    title,
    description,
    speech,
    socialImage,
    socialHeadline,
    socialSummary,
    flags,
    onwardJourney,
  };
}
