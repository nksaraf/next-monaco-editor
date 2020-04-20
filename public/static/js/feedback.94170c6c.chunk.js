(this.csbJsonP=this.csbJsonP||[]).push([[25],{"./src/app/pages/common/Modals/FeedbackModal/Feedback.tsx":function(e,n,t){"use strict";t.r(n);var a=t("../../node_modules/@babel/runtime/helpers/slicedToArray.js"),r=t.n(a),o=t("../../node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js"),i=t.n(o),c=t("../../node_modules/styled-components/dist/styled-components.browser.esm.js"),s=t("../common/lib/components/spacing/Margin.js"),l=t.n(s),u=t("../common/lib/version.js"),d=t.n(u),m=t("./src/app/overmind/index.ts"),p=t("../../node_modules/@babel/runtime/regenerator/index.js"),f=t.n(p),b=t("../../node_modules/@babel/runtime/helpers/asyncToGenerator.js"),h=t.n(b),g=function(){var e=h()(f.a.mark(function e(n){var a,r,o,i,c,s,l,u;return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=n.feedback,r=n.emoji,o=n.sandboxId,i=n.username,c=n.email,s=n.version,e.next=3,Promise.all([t.e(42),t.e(12)]).then(t.bind(null,"./src/app/overmind/utils/setAirtable.ts"));case 3:return l=e.sent,u=l.default.base("appzdQFPct2p9gFZi"),e.abrupt("return",new Promise(function(e,n){u("feedback").create({feedback:a,emoji:r,sandboxId:o,username:i,email:c,url:window.location.pathname,version:s},function(t){t&&(console.error(t),n()),e()})}));case 6:case"end":return e.stop()}},e)}));return function(n){return e.apply(this,arguments)}}(),y=t("../../node_modules/react/index.js"),v=t.n(y),j=t("../common/lib/components/AutosizeTextArea/index.js"),x=t.n(j),w=t("../common/lib/components/Button/index.js"),_=t("../common/lib/components/Input/index.js"),k=t.n(_);function E(){var e=i()(["\n  width: 100%;\n"]);return E=function(){return e},e}function C(){var e=i()(["\n        border: 2px solid rgba(255, 255, 255, 0.2);\n        background-color: ",";\n      "]);return C=function(){return e},e}function I(){var e=i()(["\n    transition: 0.3s ease all;\n    border: 2px solid rgba(0, 0, 0, 0.2);\n    background-color: rgba(0, 0, 0, 0.3);\n    border-radius: 4px;\n    padding: 0.1rem;\n    outline: 0;\n    margin-right: 1rem;\n    width: 32px;\n    height: 32px;\n    line-height: 28px;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n\n    cursor: pointer;\n\n    span {\n      display: inline;\n      line-height: initial;\n      width: 15px;\n    }\n\n    &:hover {\n      border: 2px solid rgba(255, 255, 255, 0.2);\n      background-color: ",";\n    }\n    &:focus {\n      border: 2px solid rgba(255, 255, 255, 0.2);\n    }\n\n    ",";\n  "]);return I=function(){return e},e}function O(){var e=i()(["\n  ",";\n"]);return O=function(){return e},e}function S(){var e=i()(["\n  flex: 1;\n"]);return S=function(){return e},e}function T(){var e=i()(["\n  float: right;\n"]);return T=function(){return e},e}function A(){var e=i()(["\n  width: 100%;\n"]);return A=function(){return e},e}var N=Object(c.default)(x.a).withConfig({displayName:"elements__AutosizeTextArea",componentId:"n1fylr-0"})(A()),B=Object(c.default)(w.Button).withConfig({displayName:"elements__Button",componentId:"n1fylr-1"})(T()),F=c.default.div.withConfig({displayName:"elements__ButtonContainer",componentId:"n1fylr-2"})(S()),P=c.default.button.withConfig({displayName:"elements__EmojiButton",componentId:"n1fylr-3"})(O(),function(e){var n=e.active,t=e.theme;return Object(c.css)(I(),t.secondary,n&&Object(c.css)(C(),t.secondary))}),z=Object(c.default)(k.a).withConfig({displayName:"elements__Input",componentId:"n1fylr-4"})(E());function M(){var e=i()(["\n          display: flex;\n          align-items: center;\n        "]);return M=function(){return e},e}var J=Object(c.default)(l.a).withConfig({displayName:"Feedback___StyledMargin",componentId:"sc-17hzsti-0"})(M());n.default=function(e){var n=e.id,t=e.user,a=Object(m.c)().actions,o=a.notificationAdded,i=a.modalClosed,c=Object(y.useState)((t||{}).email),s=r()(c,2),u=s[0],p=s[1],f=Object(y.useState)(null),b=r()(f,2),h=b[0],j=b[1],x=Object(y.useState)(""),w=r()(x,2),_=w[0],k=w[1],E=Object(y.useState)(!1),C=r()(E,2),I=C[0],O=C[1],S=function(e){var n=e.target,t=n.name,a=n.value;({email:p,feedback:k}[t]||function(){})(a)};return v.a.createElement("form",{onSubmit:function(e){e.preventDefault(),O(!0),g({sandboxId:n,feedback:_,emoji:h,username:(t||{}).username,email:u,version:d.a}).then(function(){j(null),k(""),O(!1),i(),o({notificationType:"success",title:"Thanks for your feedback!"})}).catch(function(e){var n=e.message;o({notificationType:"error",title:"Something went wrong while sending feedback: ".concat(n)}),O(!1)})}},v.a.createElement(N,{minRows:3,name:"feedback",onChange:S,placeholder:"What are your thoughts?",required:!0,value:_}),!t&&v.a.createElement(l.a,{top:.5},v.a.createElement(z,{name:"email",onChange:S,placeholder:"Email if you wish to be contacted",type:"email",value:u})),v.a.createElement(J,{top:.5},v.a.createElement(P,{active:"happy"===h,onClick:function(){return j("happy")},type:"button"},v.a.createElement("span",{"aria-label":"happy",role:"img"},"\ud83d\ude0a")),v.a.createElement(P,{active:"sad"===h,onClick:function(){return j("sad")},type:"button"},v.a.createElement("span",{"aria-label":"sad",role:"img"},"\ud83d\ude1e")),v.a.createElement(F,null,v.a.createElement(B,{disabled:I||!_.trim(),small:!0},I?"Sending...":"Submit"))))}}}]);
//# sourceMappingURL=feedback.94170c6c.chunk.js.map