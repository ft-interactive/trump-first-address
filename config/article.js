export default () => ({ // eslint-disable-line

  // link file UUID
  id: 'e197eab8-fad2-11e6-bd4e-68d53499ed71',

  // canonical URL of the published page
  // https://ig.ft.com/sites/trump-first-address get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/trump-first-address',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-04-11T17:26:35.602Z'),

  headline: 'Donald Trump’s address to Congress — annotated',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'The full transcript with FT correspondents’ notes and comments',

  topic: {
    name: 'Donald Trump',
    url: 'https://www.ft.com/donald-trump',
  },

  relatedArticle: {
    text: '',
    url: '',
  },

  mainImage: {
    title: '',
    description: '',
    url: '',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Courtney Weaver', url: 'https://www.ft.com/stream/authorsId/Q0ItMDAwMDg5MA==-QXV0aG9ycw==' },
    { name: 'Barney Jopson', url: 'https://www.ft.com/stream/authorsId/Q0ItMDAwMDc5MA==-QXV0aG9ycw==' },
    { name: 'Joanna S Kao', url: 'https://www.ft.com/stream/authorsId/NWRlMDQ0Y2MtODA3Mi00N2VlLWEyZGItNWRmYTZhNDNiNWNi-QXV0aG9ycw==' },
    { name: 'Claire Manibog', url: 'https://www.ft.com/stream/authorsId/ZGVhNjk2NmEtN2ZkNy00NDllLTkyODAtYjE2NWNmNjg0NTcx-QXV0aG9ycw==' },
    { name: 'Lauren Leatherby', url: 'https://www.ft.com/stream/authorsId/YWVmZWY3ZmUtMWI4ZS00NjVlLWI2OGItNzU4NjYzY2NlMDRj-QXV0aG9ycw==' },
    { name: 'Ændrew Rininsland', url: 'https://www.ft.com/stream/authorsId/MGIwMmE5MDctYzliNi00YmJkLTk1NTUtZmY3OWM2YTFkNWJj-QXV0aG9ycw==' },
    { name: 'Caroline Nevitt', url: 'https://www.ft.com/stream/authorsId/Q0ItQ042Nzg5MA==-QXV0aG9ycw==' },
  ],

  // Appears in the HTML <title>
  title: 'Donald Trump’s address to Congress annotated transcript',

  // meta data
  description: 'Donald Trump’s address to Congress, annotated by the FT',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  socialImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F24135812-f418-11e6-95ee-f14e55513608?source=ig&fit=scale-down&width=1200',
  socialHeadline: '',
  socialSummary: '',

  // TWITTER
  // twitterImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fig.ft.com%2Fsites%2Ftrump-first-address%2Fimages%2FTRUMP_SPEECH_TWITTER.jpg?source=ig&width=1200',
twitterImage: 'https://ig.ft.com/sites/trump-first-address/images/TRUMP_SPEECH_TWITTER.jpg',
twitterCreator: '@ft',
  // tweetText:  '',
//twitterHeadline:  'Trump\'s #Inauguration speech transcript, annotated',

  // FACEBOOK
  // facebookImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fig.ft.com%2Fsites%2Ftrump-first-address%2Fimages%2FTRUMP_SPEECH_FACE.jpg?source=ig&width=1200',
  facebookImage: 'https://ig.ft.com/sites/trump-first-address/images/TRUMP_SPEECH_FACE.jpg',
  // facebookHeadline: '',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
