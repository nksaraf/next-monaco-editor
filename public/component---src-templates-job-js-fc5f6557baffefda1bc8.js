(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{189:function(n,e,t){"use strict";t.r(e);var r=t(322),o=t(213),u=t(0),i=t.n(u),a=t(205),l=t(208),c=t(218),d=t(197),s=d.default.h1.withConfig({displayName:"_jobelements__Title",componentId:"sc-1l47us6-0"})(["",";"],function(n){var e=n.theme;return Object(d.css)(["font-weight:600;font-size:36px;margin-bottom:2em;margin-top:1em;padding-bottom:0;color:",";"],e.lightText)}),f=d.default.div.withConfig({displayName:"_jobelements__ContentBlock",componentId:"sc-1l47us6-1"})(["",";"],function(n){var e=n.theme;return Object(d.css)(["h2{font-weight:600;font-size:24px;margin-top:36px;color:",";}font-weight:400;font-size:18px;line-height:1.5;color:",";margin-bottom:36px;"],e.lightText,e.lightText)}),b=Object(d.default)(r.Button).withConfig({displayName:"_jobelements__ApplyButton",componentId:"sc-1l47us6-2"})(["display:inline-block;font-size:14px;line-height:1;margin-bottom:50px;"]);t.d(e,"pageQuery",function(){return p});e.default=function(n){var e=n.data.job,t=e.fields,u=t.applyLink,d=t.title,p=e.html;return i.a.createElement(a.b,null,i.a.createElement(c.a,{title:d+" - CodeSandbox Careers"}),i.a.createElement(l.a,{width:800},i.a.createElement(r.Button,{small:!0,as:o.a,to:"/jobs"},"See all jobs"),i.a.createElement(s,null,d),i.a.createElement(f,{dangerouslySetInnerHTML:{__html:p}}),i.a.createElement(f,null,i.a.createElement("h2",null,"Applying"),i.a.createElement("p",null,"Not sure you meet 100% of our qualifications? Please apply anyway!")),i.a.createElement(b,{href:u,small:!0,target:"_blank"},"Apply now")))};var p="2859433135"},207:function(n,e,t){"use strict";t(203),t(203),Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(n){var e=n.margin,t=n.top,r=n.right,o=n.left,u=n.bottom,i=n.horizontal,a=n.vertical;return([t,a,e].find(function(n){return null!=n})||0)+"rem "+([r,i,e].find(function(n){return null!=n})||0)+"rem "+([u,a,e].find(function(n){return null!=n})||0)+"rem "+([o,i,e].find(function(n){return null!=n})||0)+"rem"}},208:function(n,e,t){"use strict";t(8),t(17),t(25),t(9),t(46);var r=t(0),o=t(209),u=t.n(o),i=t(210),a=t.n(i);e.a=function(n){var e=n.children,t=function(n,e){if(null==n)return{};var t,r,o={},u=Object.keys(n);for(r=0;r<u.length;r++)t=u[r],e.indexOf(t)>=0||(o[t]=n[t]);return o}(n,["children"]);return r.createElement(u.a,Object.assign({responsive:!0,width:1440},t),r.createElement(a.a,{top:4.5,bottom:1},e))}},209:function(n,e,t){"use strict";function r(){var n=i(["\n  width: 100%;\n  max-width: ","px;\n"]);return r=function(){return n},n}function o(){var n=i(["\n      @media (max-width: 768px) {\n        padding: 0;\n      }\n    "]);return o=function(){return n},n}function u(){var n=i(["\n  box-sizing: border-box;\n  display: flex;\n\n  padding: 0 2rem;\n\n  width: 100%;\n  justify-content: center;\n\n  ",";\n"]);return u=function(){return n},n}function i(n,e){return e||(e=n.slice(0)),n.raw=e,n}var a=this&&this.__importDefault||function(n){return n&&n.__esModule?n:{default:n}},l=this&&this.__importStar||function(n){if(n&&n.__esModule)return n;var e={};if(null!=n)for(var t in n)Object.hasOwnProperty.call(n,t)&&(e[t]=n[t]);return e.default=n,e};Object.defineProperty(e,"__esModule",{value:!0});var c=a(t(0)),d=l(t(197)),s=d.default.div(u(),function(n){return n.responsive&&d.css(o())}),f=d.default.div(r(),function(n){return n.width});e.default=function(n){var e=n.children,t=n.width,r=void 0===t?1280:t,o=n.className,u=n.responsive,i=void 0!==u&&u;return c.default.createElement(s,{responsive:i},c.default.createElement(f,{className:o,width:r},e))}},210:function(n,e,t){"use strict";function r(){var n=function(n,e){e||(e=n.slice(0));return n.raw=e,n}(["\n  padding: ",";\n  box-sizing: border-box;\n"]);return r=function(){return n},n}var o=this&&this.__importDefault||function(n){return n&&n.__esModule?n:{default:n}};Object.defineProperty(e,"__esModule",{value:!0});var u=o(t(197)),i=o(t(207));e.default=u.default.div(r(),i.default)},322:function(n,e,t){"use strict";t(8),t(26),t(8),t(26);var r=this&&this.__rest||function(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(null!=n&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(n);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(n,r[o])&&(t[r[o]]=n[r[o]])}return t},o=this&&this.__importDefault||function(n){return n&&n.__esModule?n:{default:n}};Object.defineProperty(e,"__esModule",{value:!0});var u=o(t(0)),i=t(358);e.Button=function(n){var e=n.style,t=void 0===e?{}:e,o=r(n,["style"]);return o.to?u.default.createElement(i.LinkButton,Object.assign({style:t},o)):o.href?u.default.createElement(i.AButton,Object.assign({style:t},o)):u.default.createElement(i.Button,Object.assign({style:t},o))}},358:function(n,e,t){"use strict";function r(){var n=c(["\n  ",";\n"]);return r=function(){return n},n}function o(){var n=c(["\n  ",";\n"]);return o=function(){return n},n}function u(){var n=c(["\n  ",";\n"]);return u=function(){return n},n}function i(){var n=c(["\n          padding: 0.65em 2.25em;\n        "]);return i=function(){return n},n}function a(){var n=c(["\n          padding: 0.5em 0.7em;\n          font-size: 0.875em;\n        "]);return a=function(){return n},n}function l(){var n=c(["\n  transition: 0.3s ease all;\n  font-family: Poppins, Roboto, sans-serif;\n\n  border: none;\n  outline: none;\n  ",";\n  background-size: 720%;\n\n  border: ",";\n  border-radius: 4px;\n\n  box-sizing: border-box;\n  font-size: 1.125em;\n  text-align: center;\n  color: ",";\n  font-weight: 600;\n  width: ",";\n\n  user-select: none;\n  text-decoration: none;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n\n  ",";\n\n  /* svg {\n     font-size: 1.125em;\n  } */\n\n  ",";\n\n  &:hover {\n    ",";\n    ",";\n  }\n"]);return l=function(){return n},n}function c(n,e){return e||(e=n.slice(0)),n.raw=e,n}t(212),t(212);var d=this&&this.__importStar||function(n){if(n&&n.__esModule)return n;var e={};if(null!=n)for(var t in n)Object.hasOwnProperty.call(n,t)&&(e[t]=n[t]);return e.default=n,e},s=this&&this.__importDefault||function(n){return n&&n.__esModule?n:{default:n}};Object.defineProperty(e,"__esModule",{value:!0});var f=d(t(197)),b=s(t(448)),p=s(t(222)),g=f.css(l(),function(n){return t=(e=n).theme,r=e.disabled,o=e.red,u=e.secondary,i=e.danger,r?"background-color: "+(t.light?"rgba(0, 0, 0, 0.4)":p.default.background2.darken(.3)()):i?"background-color: "+p.default.dangerBackground():u?"background-color: transparent":o?"background-color: "+p.default.red.darken(.2)():t&&t["button.background"]?"background-color: "+t["button.background"]:"background-color: #40A9F3;";var e,t,r,o,u,i},function(n){return t=(e=n).theme,e.secondary,r=e.danger,o=e.red,e.disabled?t.light?"2px solid rgba(0, 0, 0, 0.3)":"2px solid #161A1C":o?"2px solid #F27777":r?"2px solid #E25D6A":t&&t["button.hoverBackground"]?"2px solid "+t["button.hoverBackground"]:"2px solid #66B9F4";var e,t,r,o},function(n){return t=(e=n).disabled,r=e.secondary,o=e.theme,t?p.default.background2.lighten(1.5)():r?o.light?"rgba(0, 0, 0, 0.75)":"rgba(255, 255, 255, 0.75)":"white";var e,t,r,o},function(n){return n.block?"100%":"inherit"},function(n){return n.small?f.css(a()):f.css(i())},function(n){return!n.disabled&&"\n  cursor: pointer;\n  "},function(n){return t=(e=n).theme,r=e.disabled,o=e.red,u=e.secondary,i=e.danger,r?"background-color: "+(t.light?"rgba(0, 0, 0, 0.4)":p.default.background2.darken(.3)()):i?"background-color: #E25D6A":o?"background-color: #F27777":t&&t["button.hoverBackground"]?"background-color: "+t["button.hoverBackground"]:u?"background-color: #66b9f4":"background-color: #66b9f4;";var e,t,r,o,u,i},function(n){return t=(e=n).secondary,e.disabled?"":t?"color: white":"";var e,t});e.LinkButton=f.default(b.default)(u(),g),e.AButton=f.default.a(o(),g),e.Button=f.default.button(r(),g)}}]);
//# sourceMappingURL=component---src-templates-job-js-fc5f6557baffefda1bc8.js.map