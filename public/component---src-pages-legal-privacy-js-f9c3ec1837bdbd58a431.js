(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{181:function(e,n,i){"use strict";i.r(n);var o=i(808),t=i(0),a=i.n(t),r=i(215),s=i(289),c=i(421);n.default=function(){return a.a.createElement(c.a,null,a.a.createElement(r.b,{query:"1983975423",render:function(e){var n=e.allMarkdownRemark.edges;return a.a.createElement(s.a,{dangerouslySetInnerHTML:{__html:n[0].node.html}})},data:o}))}},207:function(e,n,i){"use strict";i(202),i(202),Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.margin,i=e.top,o=e.right,t=e.left,a=e.bottom,r=e.horizontal,s=e.vertical;return([i,s,n].find(function(e){return null!=e})||0)+"rem "+([o,r,n].find(function(e){return null!=e})||0)+"rem "+([a,s,n].find(function(e){return null!=e})||0)+"rem "+([t,r,n].find(function(e){return null!=e})||0)+"rem"}},208:function(e,n,i){"use strict";i(8),i(17),i(25),i(9),i(46);var o=i(0),t=i(209),a=i.n(t),r=i(210),s=i.n(r);n.a=function(e){var n=e.children,i=function(e,n){if(null==e)return{};var i,o,t={},a=Object.keys(e);for(o=0;o<a.length;o++)i=a[o],n.indexOf(i)>=0||(t[i]=e[i]);return t}(e,["children"]);return o.createElement(a.a,Object.assign({responsive:!0,width:1440},i),o.createElement(s.a,{top:4.5,bottom:1},n))}},209:function(e,n,i){"use strict";function o(){var e=r(["\n  width: 100%;\n  max-width: ","px;\n"]);return o=function(){return e},e}function t(){var e=r(["\n      @media (max-width: 768px) {\n        padding: 0;\n      }\n    "]);return t=function(){return e},e}function a(){var e=r(["\n  box-sizing: border-box;\n  display: flex;\n\n  padding: 0 2rem;\n\n  width: 100%;\n  justify-content: center;\n\n  ",";\n"]);return a=function(){return e},e}function r(e,n){return n||(n=e.slice(0)),e.raw=n,e}var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},c=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var i in e)Object.hasOwnProperty.call(e,i)&&(n[i]=e[i]);return n.default=e,n};Object.defineProperty(n,"__esModule",{value:!0});var l=s(i(0)),h=c(i(197)),d=h.default.div(a(),function(e){return e.responsive&&h.css(t())}),u=h.default.div(o(),function(e){return e.width});n.default=function(e){var n=e.children,i=e.width,o=void 0===i?1280:i,t=e.className,a=e.responsive,r=void 0!==a&&a;return l.default.createElement(d,{responsive:r},l.default.createElement(u,{className:t,width:o},n))}},210:function(e,n,i){"use strict";function o(){var e=function(e,n){n||(n=e.slice(0));return e.raw=n,e}(["\n  padding: ",";\n  box-sizing: border-box;\n"]);return o=function(){return e},e}var t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});var a=t(i(197)),r=t(i(207));n.default=a.default.div(o(),r.default)},239:function(e,n,i){"use strict";i(245)("link",function(e){return function(n){return e(this,"a","href",n)}})},289:function(e,n,i){"use strict";i.d(n,"a",function(){return a}),i.d(n,"c",function(){return r}),i.d(n,"b",function(){return s});i(239);var o=i(197),t=i(215),a=o.default.div.withConfig({displayName:"_elements__Content",componentId:"m0qsrm-0"})(["margin-top:5%;text-align:left;max-width:800px;line-height:1.5;margin-bottom:4rem;color:rgba(255,255,255,0.7);h1,h2{color:rgba(255,255,255,0.9);margin:30px 0;}"]),r=Object(o.default)(t.a).withConfig({displayName:"_elements__NavigationLink",componentId:"m0qsrm-1"})(["transition:0.3s ease all;display:block;margin:1.5rem 0;font-size:1.25rem;text-decoration:none;color:rgba(255,255,255,0.5);text-transform:uppercase;&:after{content:'';margin-top:8px;display:block;background:",";height:2px;box-sizing:border-box;width:0%;margin-left:-5%;transition:all 200ms ease;@media screen and (max-width:500px){margin-left:0%;}}&.active,&:hover{color:",";&:after{width:110%;@media screen and (max-width:500px){width:100%;}}}"],function(e){return e.theme.link},function(e){return e.theme.homepage.white}),s=o.default.div.withConfig({displayName:"_elements__LegalNavigation",componentId:"m0qsrm-2"})(["display:flex;justify-content:space-around;width:100%;margin-bottom:3rem;@media screen and (max-width:500px){display:block;text-align:center;}"])},421:function(e,n,i){"use strict";var o=i(0),t=i.n(o),a=i(289),r=function(){return t.a.createElement(a.b,null,t.a.createElement(a.c,{to:"/legal/terms",activeClassName:"active"},"Terms and Conditions"),t.a.createElement(a.c,{to:"/legal/privacy",activeClassName:"active"},"Privacy Policy"))},s=i(205),c=i(216),l=i(208);n.a=function(e){var n=e.children;return t.a.createElement(s.c,null,t.a.createElement(c.a,{title:"CodeSandbox - Privacy Policy"}),t.a.createElement(l.a,{width:1024},t.a.createElement(r,null),n))}},808:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{html:'<h1 id="privacy-policy"><a href="#privacy-policy" aria-label="privacy policy permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Privacy Policy</h1>\n<p><em>Last Edited on 2017-07-19</em></p>\n<p>This privacy policy has been compiled to better serve those who are concerned\nwith how their \'Personally Identifiable Information\' (PII) is being used online.\nPII, as described in US privacy law and information security, is information\nthat can be used on its own or with other information to identify, contact, or\nlocate a single person, or to identify an individual in context. Please read our\nprivacy policy carefully to get a clear understanding of how we collect, use,\nprotect or otherwise handle your Personally Identifiable Information in\naccordance with our website.</p>\n<section>\n<h2 id="what-personal-information-do-we-collect-from-the-people-that-visit-our-blog-website-or-app"><a href="#what-personal-information-do-we-collect-from-the-people-that-visit-our-blog-website-or-app" aria-label="what personal information do we collect from the people that visit our blog website or app permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>What personal information do we collect from the people that visit our blog, website or app?</h2>\n<p>When ordering or registering on our site, as appropriate, you may be asked to\nenter your name, email address, credit card information or other details to help\nyou with your experience.</p>\n</section>\n<section>\n<h2 id="when-do-we-collect-information"><a href="#when-do-we-collect-information" aria-label="when do we collect information permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>When do we collect information?</h2>\n<p>We collect information from you when you register on our site, place an order or\nenter information on our site.</p>\n</section>\n<section>\n<h2 id="how-do-we-use-your-information"><a href="#how-do-we-use-your-information" aria-label="how do we use your information permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>How do we use your information?</h2>\n<p>We may use the information we collect from you when you register, make a\npurchase, sign up for our newsletter, respond to a survey or marketing\ncommunication, surf the website, or use certain other site features in the\nfollowing ways:</p>\n<ul>\n<li>To improve our website in order to better serve you.</li>\n<li>To allow us to better service you in responding to your customer service\nrequests.</li>\n<li>To quickly process your transactions.</li>\n<li>To send periodic emails regarding your order or other products and services.</li>\n<li>To follow up with them after correspondence (live chat, email or phone\ninquiries)</li>\n</ul>\n</section>\n<section>\n<h2 id="how-do-we-protect-your-information"><a href="#how-do-we-protect-your-information" aria-label="how do we protect your information permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>How do we protect your information?</h2>\n<p>We do not use vulnerability scanning and/or scanning to PCI standards.</p>\n<p>An external PCI compliant payment gateway handles all CC transactions.</p>\n<p>We do not use Malware Scanning.</p>\n<p>Your personal information is contained behind secured networks and is only\naccessible by a limited number of persons who have special access rights to such\nsystems, and are required to keep the information confidential. In addition, all\nsensitive/credit information you supply is encrypted via Secure Socket Layer\n(SSL) technology.</p>\n<p>We implement a variety of security measures when a user places an order enters,\nsubmits, or accesses their information to maintain the safety of your personal\ninformation.</p>\n<p>All transactions are processed through a gateway provider and are not stored or\nprocessed on our servers.</p>\n</section>\n<section>\n<h2 id="do-we-use-cookies"><a href="#do-we-use-cookies" aria-label="do we use cookies permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Do we use \'cookies\'?</h2>\n<p>Yes. Cookies are small files that a site or its service provider transfers to\nyour computer\'s hard drive through your Web browser (if you allow) that enables\nthe site\'s or service provider\'s systems to recognize your browser and capture\nand remember certain information. For instance, we use cookies to help us\nremember and process the items in your shopping cart. They are also used to help\nus understand your preferences based on previous or current site activity, which\nenables us to provide you with improved services. We also use cookies to help us\ncompile aggregate data about site traffic and site interaction so that we can\noffer better site experiences and tools in the future.</p>\n</section>\n<section>\n<h2 id="we-use-cookies-to"><a href="#we-use-cookies-to" aria-label="we use cookies to permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>We use cookies to:</h2>\n<ul>\n<li>Understand and save user\'s preferences for future visits.</li>\n<li>Compile aggregate data about site traffic and site interactions in order to\noffer better site experiences and tools in the future. We may also use trusted\nthird-party services that track this information on our behalf.</li>\n</ul>\n<p>You can choose to have your computer warn you each time a cookie is being sent,\nor you can choose to turn off all cookies. You do this through your browser\nsettings. Since browser is a little different, look at your browser\'s Help Menu\nto learn the correct way to modify your cookies.</p>\n<p>If you turn cookies off, Some of the features that make your site experience\nmore efficient may not function properly.It won\'t affect the user\'s experience\nthat make your site experience more efficient and may not function properly.</p>\n</section>\n<section>\n<h2 id="third-party-disclosure"><a href="#third-party-disclosure" aria-label="third party disclosure permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Third-party disclosure</h2>\n<p>We do not sell, trade, or otherwise transfer to outside parties your Personally\nIdentifiable Information unless we provide users with advance notice. This does\nnot include website hosting partners and other parties who assist us in\noperating our website, conducting our business, or serving our users, so long as\nthose parties agree to keep this information confidential. We may also release\ninformation when it\'s release is appropriate to comply with the law, enforce our\nsite policies, or protect ours or other"} rights, property or safety.</p>\n<p>However, non-personally identifiable visitor information may be provided to\nother parties for marketing, advertising, or other uses.</p>\n</section>\n<section>\n<h2 id="third-party-links"><a href="#third-party-links" aria-label="third party links permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Third-party links</h2>\n<p>Occasionally, at our discretion, we may include or offer third-party products or\nservices on our website. These third-party sites have separate and independent\nprivacy policies. We therefore have no responsibility or liability for the\ncontent and activities of these linked sites. Nonetheless, we seek to protect\nthe integrity of our site and welcome any feedback about these sites.</p>\n</section>\n<section>\n<h2 id="google"><a href="#google" aria-label="google permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Google</h2>\n<p>Google\'s advertising requirements can be summed up by Google\'s Advertising\nPrinciples. They are put in place to provide a positive experience for users.\n<a href="https://support.google.com/adwordspolicy/answer/1316548?hl=en">https://support.google.com/adwordspolicy/answer/1316548?hl=en</a></p>\n<p>We use Google AdSense Advertising on our website.</p>\n<p>Google, as a third-party vendor, uses cookies to serve ads on our site. Google\'s\nuse of the DART cookie enables it to serve ads to our users based on previous\nvisits to our site and other sites on the Internet. Users may opt-out of the use\nof the DART cookie by visiting the Google Ad and Content Network privacy policy.</p>\n</section>\n<section>\n<h2 id="we-have-implemented-the-following"><a href="#we-have-implemented-the-following" aria-label="we have implemented the following permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>We have implemented the following:</h2>\n<ul>\n<li>Remarketing with Google AdSense</li>\n<li>Demographics and Interests Reporting</li>\n</ul>\n<p>We, along with third-party vendors such as Google use first-party cookies (such\nas the Google Analytics cookies) and third-party cookies (such as the\nDoubleClick cookie) or other third-party identifiers together to compile data\nregarding user interactions with ad impressions and other ad service functions\nas they relate to our website.</p>\n</section>\n<section>\n<h2 id="opting-out"><a href="#opting-out" aria-label="opting out permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Opting out:</h2>\n<p>Users can set preferences for how Google advertises to you using the Google Ad\nSettings page. Alternatively, you can opt out by visiting the Network\nAdvertising Initiative Opt Out page or by using the Google Analytics Opt Out\nBrowser add on.</p>\n</section>\n<section>\n<h2 id="california-online-privacy-protection-act"><a href="#california-online-privacy-protection-act" aria-label="california online privacy protection act permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>California Online Privacy Protection Act</h2>\n<p>CalOPPA is the first state law in the nation to require commercial websites and\nonline services to post a privacy policy. The law\'s reach stretches well beyond\nCalifornia to require any person or company in the United States (and\nconceivably the world) that operates websites collecting Personally Identifiable\nInformation from California consumers to post a conspicuous privacy policy on\nits website stating exactly the information being collected and those\nindividuals or companies with whom it is being shared. - See more at:\n<a href="http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf">http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf</a></p>\n</section>\n<section>\n<h2 id="according-to-caloppa-we-agree-to-the-following"><a href="#according-to-caloppa-we-agree-to-the-following" aria-label="according to caloppa we agree to the following permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>According to CalOPPA, we agree to the following:</h2>\n<p>Users can visit our site anonymously.</p>\n<p>Once this privacy policy is created, we will add a link to it on our home page\nor as a minimum, on the first significant page after entering our website.</p>\n<p>Our Privacy Policy link includes the word \'Privacy\' and can easily be found on\nthe page specified above.</p>\n<p>You will be notified of any Privacy Policy changes:</p>\n<ul>\n<li>On our Privacy Policy Page</li>\n</ul>\n<p><strong>Can change your personal information:</strong></p>\n<ul>\n<li>By emailing us</li>\n<li>By logging in to your account</li>\n</ul>\n</section>\n<section>\n<h2 id="how-does-our-site-handle-do-not-track-signals"><a href="#how-does-our-site-handle-do-not-track-signals" aria-label="how does our site handle do not track signals permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>How does our site handle Do Not Track signals?</h2>\n<p>We honor Do Not Track signals and Do Not Track, plant cookies, or use\nadvertising when a Do Not Track (DNT) browser mechanism is in place.</p>\n</section>\n<section>\n<h2 id="does-our-site-allow-third-party-behavioral-tracking"><a href="#does-our-site-allow-third-party-behavioral-tracking" aria-label="does our site allow third party behavioral tracking permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Does our site allow third-party behavioral tracking?</h2>\n<p>It\'s also important to note that we do not allow third-party behavioral tracking</p>\n</section>\n<section>\n<h2 id="coppa-children-online-privacy-protection-act"><a href="#coppa-children-online-privacy-protection-act" aria-label="coppa children online privacy protection act permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>COPPA (Children Online Privacy Protection Act)</h2>\n<p>When it comes to the collection of personal information from children under the\nage of 13 years old, the Children\'s Online Privacy Protection Act (COPPA) puts\nparents in control. The Federal Trade Commission, United States\' consumer\nprotection agency, enforces the COPPA Rule, which spells out what operators of\nwebsites and online services must do to protect children\'s privacy and safety\nonline.</p>\n<p>We do not specifically market to children under the age of 13 years old.</p>\n<p>Do we let third-parties, including ad networks or plug-ins collect PII from\nchildren under 13?</p>\n</section>\n<section>\n<h2 id="fair-information-practices"><a href="#fair-information-practices" aria-label="fair information practices permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Fair Information Practices</h2>\n<p>The Fair Information Practices Principles form the backbone of privacy law in\nthe United States and the concepts they include have played a significant role\nin the development of data protection laws around the globe. Understanding the\nFair Information Practice Principles and how they should be implemented is\ncritical to comply with the various privacy laws that protect personal\ninformation.</p>\n<h3 id="in-order-to-be-in-line-with-fair-information-practices-we-will-take-the-following-responsive-action-should-a-data-breach-occur"><a href="#in-order-to-be-in-line-with-fair-information-practices-we-will-take-the-following-responsive-action-should-a-data-breach-occur" aria-label="in order to be in line with fair information practices we will take the following responsive action should a data breach occur permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</h3>\n<p>We will notify you via email</p>\n<ul>\n<li>Within 1 business day</li>\n</ul>\n<p><strong>We will notify the users via in-site notification</strong></p>\n<ul>\n<li>Within 1 business day</li>\n</ul>\n<p>We also agree to the Individual Redress Principle which requires that\nindividuals have the right to legally pursue enforceable rights against data\ncollectors and processors who fail to adhere to the law. This principle requires\nnot only that individuals have enforceable rights against data users, but also\nthat individuals have recourse to courts or government agencies to investigate\nand/or prosecute non-compliance by data processors.</p>\n</section>\n<section>\n<h2 id="can-spam-act"><a href="#can-spam-act" aria-label="can spam act permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>CAN SPAM Act</h2>\n<p>The CAN-SPAM Act is a law that sets the rules for commercial email, establishes\nrequirements for commercial messages, gives recipients the right to have emails\nstopped from being sent to them, and spells out tough penalties for violations.</p>\n</section>\n<section>\n<h2 id="we-collect-your-email-address-in-order-to"><a href="#we-collect-your-email-address-in-order-to" aria-label="we collect your email address in order to permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>We collect your email address in order to:</h2>\n<ul>\n<li>Send information, respond to inquiries, and/or other requests or questions</li>\n<li>Process orders and to send information and updates pertaining to orders.</li>\n<li>Market to our mailing list or continue to send emails to our clients after the\noriginal transaction has occurred.</li>\n</ul>\n</section>\n<section>\n<h2 id="to-be-in-accordance-with-canspam-we-agree-to-the-following"><a href="#to-be-in-accordance-with-canspam-we-agree-to-the-following" aria-label="to be in accordance with canspam we agree to the following permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>To be in accordance with CANSPAM, we agree to the following:</h2>\n<ul>\n<li>Not use false or misleading subjects or email addresses.</li>\n<li>Identify the message as an advertisement in some reasonable way.</li>\n<li>Include the physical address of our business or site headquarters.</li>\n<li>Monitor third-party email marketing services for compliance, if one is used.</li>\n<li>Honor opt-out/unsubscribe requests quickly.</li>\n<li>Allow users to unsubscribe by using the link at the bottom of each email.</li>\n</ul>\n<p><strong>If at any time you would like to unsubscribe from receiving future emails, you\ncan email us at hello@codesandbox.io</strong></p>\n<ul>\n<li>Follow the instructions at the bottom of each email. and we will promptly\nremove you from <strong>ALL</strong> correspondence.</li>\n</ul>\n</section>\n<section>\n<h2 id="contacting-us"><a href="#contacting-us" aria-label="contacting us permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Contacting Us</h2>\n<p>If there are any questions regarding this privacy policy, you may contact us\nusing the information below.</p>\n<p>codesandbox.io<br>\nCalslaan 5B<br>\nEnschede, Overijssel 7522 MH<br>\nNetherlands<br>\nhello@codesandbox.io</p>\n</section>'}}]}}}}}]);
//# sourceMappingURL=component---src-pages-legal-privacy-js-f9c3ec1837bdbd58a431.js.map