(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{182:function(e,n,t){"use strict";t.r(n);var i=t(790),o=t(0),a=t.n(o),r=t(209),s=t(324),c=t(435);n.default=function(){return a.a.createElement(c.a,null,a.a.createElement(r.b,{query:"2629907227",render:function(e){var n=e.allMarkdownRemark.edges;return a.a.createElement(s.a,{dangerouslySetInnerHTML:{__html:n[0].node.html}})},data:i}))}},214:function(e,n,t){"use strict";t(205),t(205),Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.margin,t=e.top,i=e.right,o=e.left,a=e.bottom,r=e.horizontal,s=e.vertical;return([t,s,n].find(function(e){return null!=e})||0)+"rem "+([i,r,n].find(function(e){return null!=e})||0)+"rem "+([a,s,n].find(function(e){return null!=e})||0)+"rem "+([o,r,n].find(function(e){return null!=e})||0)+"rem"}},217:function(e,n,t){"use strict";t(8),t(17),t(25),t(9),t(46);var i=t(0),o=t(218),a=t.n(o),r=t(219),s=t.n(r);n.a=function(e){var n=e.children,t=function(e,n){if(null==e)return{};var t,i,o={},a=Object.keys(e);for(i=0;i<a.length;i++)t=a[i],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,["children"]);return i.createElement(a.a,Object.assign({responsive:!0,width:1440},t),i.createElement(s.a,{top:4.5,bottom:1},n))}},218:function(e,n,t){"use strict";function i(){var e=r(["\n  width: 100%;\n  max-width: ","px;\n"]);return i=function(){return e},e}function o(){var e=r(["\n      @media (max-width: 768px) {\n        padding: 0;\n      }\n    "]);return o=function(){return e},e}function a(){var e=r(["\n  box-sizing: border-box;\n  display: flex;\n\n  padding: 0 2rem;\n\n  width: 100%;\n  justify-content: center;\n\n  ",";\n"]);return a=function(){return e},e}function r(e,n){return n||(n=e.slice(0)),e.raw=n,e}var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},c=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n.default=e,n};Object.defineProperty(n,"__esModule",{value:!0});var h=s(t(0)),l=c(t(203)),d=l.default.div(a(),function(e){return e.responsive&&l.css(o())}),u=l.default.div(i(),function(e){return e.width});n.default=function(e){var n=e.children,t=e.width,i=void 0===t?1280:t,o=e.className,a=e.responsive,r=void 0!==a&&a;return h.default.createElement(d,{responsive:r},h.default.createElement(u,{className:o,width:i},n))}},219:function(e,n,t){"use strict";function i(){var e=function(e,n){n||(n=e.slice(0));return e.raw=n,e}(["\n  padding: ",";\n  box-sizing: border-box;\n"]);return i=function(){return e},e}var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});var a=o(t(203)),r=o(t(214));n.default=a.default.div(i(),r.default)},250:function(e,n,t){"use strict";t(255)("link",function(e){return function(n){return e(this,"a","href",n)}})},324:function(e,n,t){"use strict";t.d(n,"a",function(){return a}),t.d(n,"c",function(){return r}),t.d(n,"b",function(){return s});t(250);var i=t(197),o=t(209),a=i.d.div.withConfig({displayName:"_elements__Content",componentId:"m0qsrm-0"})(["margin-top:5%;text-align:left;max-width:800px;line-height:1.5;margin-bottom:4rem;color:rgba(255,255,255,0.7);h1,h2{color:rgba(255,255,255,0.9);margin:30px 0;}"]),r=Object(i.d)(o.a).withConfig({displayName:"_elements__NavigationLink",componentId:"m0qsrm-1"})(["transition:0.3s ease all;display:block;margin:1.5rem 0;font-size:1.25rem;text-decoration:none;color:rgba(255,255,255,0.5);text-transform:uppercase;&:after{content:'';margin-top:8px;display:block;background:",";height:2px;box-sizing:border-box;width:0%;margin-left:-5%;transition:all 200ms ease;@media screen and (max-width:500px){margin-left:0%;}}&.active,&:hover{color:",";&:after{width:110%;@media screen and (max-width:500px){width:100%;}}}"],function(e){return e.theme.link},function(e){return e.theme.homepage.white}),s=i.d.div.withConfig({displayName:"_elements__LegalNavigation",componentId:"m0qsrm-2"})(["display:flex;justify-content:space-around;width:100%;margin-bottom:3rem;@media screen and (max-width:500px){display:block;text-align:center;}"])},435:function(e,n,t){"use strict";var i=t(0),o=t.n(i),a=t(324),r=function(){return o.a.createElement(a.b,null,o.a.createElement(a.c,{to:"/legal/terms",activeClassName:"active"},"Terms and Conditions"),o.a.createElement(a.c,{to:"/legal/privacy",activeClassName:"active"},"Privacy Policy"))},s=t(220),c=t(221),h=t(217);n.a=function(e){var n=e.children;return o.a.createElement(s.b,null,o.a.createElement(c.a,{title:"CodeSandbox - Privacy Policy"}),o.a.createElement(h.a,{width:1024},o.a.createElement(r,null),n))}},790:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{html:'<h1 id="terms-and-conditions"><a href="#terms-and-conditions" aria-label="terms and conditions permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Terms and Conditions</h1>\n<p><em>Last Edited on 2017-07-20</em></p>\n<p>These Terms and Conditions ("Terms", "Terms and Conditions") govern your\nrelationship with <a href="https://codesandbox.io">https://codesandbox.io</a> website (the "Service") and the Sandbox\ncreation service therein operated by CodeSandbox BV ("us", "we", or "our").</p>\n<p>Please read these Terms and Conditions carefully before using the Service.</p>\n<p>Your access to and use of the Service is conditioned on your acceptance of and\ncompliance with these Terms. These Terms apply to all visitors, users and others\nwho access or use the Service. Any information submitted by you shall be subject\nto CodeSandbox\'s Privacy Policy. One person or legal entity may not maintain\nmore than one Account. Accounts registered by “bots” or other automated methods\nare not permitted.</p>\n<p>By accessing or using the Service you agree to be bound by these Terms. If you\ndisagree with any part of the terms then you may not access the Service.</p>\n<section>\n<h2 id="subscriptions"><a href="#subscriptions" aria-label="subscriptions permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Subscriptions</h2>\n<p>Some parts of the Service are billed on a subscription basis Subscription(s).\nYou will be billed in advance on a recurring and periodic basis ("Billing\nCycle"). Billing cycles are set on a monthly basis.</p>\n<p>At the end of each Billing Cycle, your Subscription will automatically renew\nunder the exact same conditions unless you cancel it or CodeSandbox BV cancels\nit. You may cancel your Subscription renewal either through your online account\nmanagement page or by contacting CodeSandbox BV customer support team.</p>\n<p>A valid payment method, including credit card, is required to process the\npayment for your Subscription. You shall provide CodeSandbox BV with accurate\nand complete billing information including full name, zip code, and a valid\npayment method information. By submitting such payment information, you\nautomatically authorize CodeSandbox BV to charge all Subscription fees incurred\nthrough your account to any such payment instruments.</p>\n<p>Should automatic billing fail to occur for any reason, CodeSandbox BV will issue\nan electronic invoice indicating that you must proceed manually, within a\ncertain deadline date, with the full payment corresponding to the billing period\nas indicated on the invoice.</p>\n</section>\n<section>\n<h2 id="fee-changes"><a href="#fee-changes" aria-label="fee changes permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Fee Changes</h2>\n<p>CodeSandbox BV, in its sole discretion and at any time, may modify the\nSubscription fees for the Subscriptions. Any Subscription fee change will become\neffective at the end of the then-current Billing Cycle.</p>\n<p>CodeSandbox BV will provide you with a reasonable prior notice of any change in\nSubscription fees to give you an opportunity to terminate your Subscription\nbefore such change becomes effective.</p>\n<p>Your continued use of the Service after the Subscription fee change comes into\neffect constitutes your agreement to pay the modified Subscription fee amount.</p>\n</section>\n<section>\n<h2 id="refunds"><a href="#refunds" aria-label="refunds permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Refunds</h2>\n<p>Certain refund requests for Subscriptions may be considered by CodeSandbox BV on\na case-by-case basis and granted in sole discretion of CodeSandbox BV.</p>\n</section>\n<section>\n<h2 id="content"><a href="#content" aria-label="content permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Content</h2>\n<p>Our Service allows you to post, link, store, share and otherwise make available\ncertain information, text, graphics, videos, or other material ("Content"). You\nare responsible for the Content that you post to the Service, including its\nlegality, reliability, and appropriateness.</p>\n<p>By posting Content to the Service, you grant us and other users of the Service\nthe right and the license to use, modify, publicly perform, publicly display,\nreproduce, and distribute such Content on and through the Service. Such Content\nshall be licensed upon the terms of the MIT licence. You retain any and all of\nyour rights to any Content you submit, post or display on or through the Service\nand you are responsible for protecting those rights. You agree that this license\nincludes the right for us to make your Content available to other users of the\nService, who may also use your Content subject to these Terms. If you\nspecifically save a Sandbox as private to CodeSandbox, and that Sandbox has\nnever been public on CodeSandbox or anywhere else, the code in that particular\nSandbox is unlicensed.</p>\n<p>You represent and warrant that: (i) the Content is yours (you own it) or you\nhave the right to use it and grant us the rights and license as provided in\nthese Terms, and (ii) the posting of your Content on or through the Service does\nnot violate the privacy rights, publicity rights, copyrights, contract rights or\nany other rights of any person.</p>\n</section>\n<section>\n<h2 id="accounts"><a href="#accounts" aria-label="accounts permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Accounts</h2>\n<p>When you create an account with us, you must provide us information that is\naccurate, complete, and current at all times. Failure to do so constitutes a\nbreach of the Terms, which may result in immediate termination of your account\non our Service.</p>\n<p>You are responsible for safeguarding the password that you use to access the\nService and for any activities or actions under your password, whether your\npassword is with our Service or a third-party service.</p>\n<p>You agree not to disclose your password to any third party. You must notify us\nimmediately upon becoming aware of any breach of security or unauthorized use of\nyour account.</p>\n</section>\n<section>\n<h2 id="links-to-other-web-sites"><a href="#links-to-other-web-sites" aria-label="links to other web sites permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Links To Other Web Sites</h2>\n<p>Our Service may contain links to third-party web sites or services that are not\nowned or controlled by CodeSandbox BV.</p>\n<p>CodeSandbox BV has no control over, and assumes no responsibility for, the\ncontent, privacy policies, or practices of any third party web sites or\nservices. You further acknowledge and agree that CodeSandbox BV shall not be\nresponsible or liable, directly or indirectly, for any damage or loss caused or\nalleged to be caused by or in connection with use of or reliance on any such\ncontent, goods or services available on or through any such web sites or\nservices.</p>\n<p>We strongly advise you to read the terms and conditions and privacy policies of\nany third-party web sites or services that you visit.</p>\n</section>\n<section>\n<h2 id="termination"><a href="#termination" aria-label="termination permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Termination</h2>\n<p>We may terminate or suspend your account immediately, without prior notice or\nliability, for any reason whatsoever, including without limitation if you breach\nthe Terms.</p>\n<p>Upon termination, your right to use the Service will immediately cease. If you\nwish to terminate your account, you may simply discontinue using the Service.</p>\n</section>\n<section>\n<h2 id="limitation-of-liability"><a href="#limitation-of-liability" aria-label="limitation of liability permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Limitation Of Liability</h2>\n<p>In no event shall CodeSandbox BV, nor its directors, employees, partners,\nagents, suppliers, or affiliates, be liable for any indirect, incidental,\nspecial, consequential or punitive damages, including without limitation, loss\nof profits, data, use, goodwill, or other intangible losses, resulting from (i)\nyour access to or use of or inability to access or use the Service; (ii) any\nconduct or content of any third party on the Service; (iii) any content obtained\nfrom the Service; and (iv) unauthorized access, use or alteration of your\ntransmissions or content, whether based on warranty, contract, tort (including\nnegligence) or any other legal theory, whether or not we have been informed of\nthe possibility of such damage, and even if a remedy set forth herein is found\nto have failed of its essential purpose.</p>\n</section>\n<section>\n<h2 id="disclaimer"><a href="#disclaimer" aria-label="disclaimer permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Disclaimer</h2>\n<p>Your use of the Service is at your sole risk. The Service is provided on an "AS\nIS" and "AS AVAILABLE" basis. The Service is provided without warranties of any\nkind, whether express or implied, including, but not limited to, implied\nwarranties of merchantability, fitness for a particular purpose,\nnon-infringement or course of performance.</p>\n<p>CodeSandbox BV its subsidiaries, affiliates, and its licensors do not warrant\nthat a) the Service will function uninterrupted, secure or available at any\nparticular time or location; b) any errors or defects will be corrected; c) the\nService is free of viruses or other harmful components; or d) the results of\nusing the Service will meet your requirements.</p>\n</section>\n<section>\n<h2 id="governing-law"><a href="#governing-law" aria-label="governing law permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Governing Law</h2>\n<p>These Terms shall be governed and construed in accordance with the laws of\nNetherlands, without regard to its conflict of law provisions.</p>\n<p>Our failure to enforce any right or provision of these Terms will not be\nconsidered a waiver of those rights. If any provision of these Terms is held to\nbe invalid or unenforceable by a court, the remaining provisions of these Terms\nwill remain in effect. These Terms constitute the entire agreement between us\nregarding our Service, and supersede and replace any prior agreements we might\nhave between us regarding the Service.</p>\n</section>\n<section>\n<h2 id="changes"><a href="#changes" aria-label="changes permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Changes</h2>\n<p>We reserve the right, at our sole discretion, to modify or replace these Terms\nat any time. If a revision is material we will try to provide at least 30 days\nnotice prior to any new terms taking effect. What constitutes a material change\nwill be determined at our sole discretion.</p>\n<p>By continuing to access or use our Service after those revisions become\neffective, you agree to be bound by the revised terms. If you do not agree to\nthe new terms, please stop using the Service.</p>\n</section>\n<section>\n<h2 id="contact-us"><a href="#contact-us" aria-label="contact us permalink" class="anchor"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Contact Us</h2>\n<p><iframe src="https://If%20you%20have%20any%20questions%20about%20these%20Terms,%20please%20contact%20us%20athello@codesandbox.io/" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"></iframe></p>\n</section>'}}]}}}}}]);
//# sourceMappingURL=component---src-pages-legal-terms-js-17621f27237fa5eb0b16.js.map