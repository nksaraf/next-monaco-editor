(this.csbJsonP=this.csbJsonP||[]).push([[30],{"./src/app/pages/Curator/index.tsx":function(e,n,t){"use strict";t.r(n);var a=t("../../node_modules/@babel/runtime/helpers/extends.js"),o=t.n(a),r=t("../../node_modules/@babel/runtime/helpers/slicedToArray.js"),i=t.n(r),l=t("../../node_modules/react/index.js"),c=t.n(l),s=t("./node_modules/date-fns/esm/getTime/index.js"),u=t("./node_modules/date-fns/esm/subWeeks/index.js"),m=t("./node_modules/date-fns/esm/subMonths/index.js"),d=t("./node_modules/date-fns/esm/format/index.js"),p=t("../../node_modules/react-day-picker/DayPicker.js"),f=t.n(p),b=t("../common/lib/components/Button/index.js"),g=t("../common/lib/components/spacing/Margin.js"),x=t.n(g),h=t("../common/lib/components/flex/MaxWidth.js"),j=t.n(h),y=t("./src/app/overmind/index.ts"),v=t("./src/app/components/SubTitle.ts"),k=t("./src/app/components/DelayedAnimation.ts"),C=t("./src/app/pages/common/Navigation/index.tsx"),_=(t("../../node_modules/react-day-picker/lib/style.css"),t("../../node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js")),w=t.n(_),E=t("../../node_modules/styled-components/dist/styled-components.browser.esm.js"),O=t("./src/app/components/Title.ts");function I(){var e=w()(["\n  position: absolute;\n  z-index: 10;\n  background: #1c2022;\n  border-radius: 3px;\n  top: 45px;\n  right: 14px;\n"]);return I=function(){return e},e}function S(){var e=w()(["\n  display: flex;\n  justify-content: flex-end;\n  margin: 3rem 0;\n  align-items: center;\n  position: relative;\n\n  button:first-child {\n    margin-left: 1rem;\n  }\n\n  button:not(:last-child) {\n    margin-right: 1rem;\n  }\n"]);return S=function(){return e},e}function N(){var e=w()(["\n  height: 100%;\n  width: 100%;\n  margin: 1rem;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(100px, 1fr));\n  grid-column-gap: 2rem;\n  grid-row-gap: 2rem;\n"]);return N=function(){return e},e}function D(){var e=w()(["\n  margin-top: 3rem;\n"]);return D=function(){return e},e}var M=Object(E.default)(O.a).withConfig({displayName:"elements__Heading",componentId:"sc-11ir6fi-0"})(D()),P=E.default.div.withConfig({displayName:"elements__Container",componentId:"sc-11ir6fi-1"})(N()),T=E.default.section.withConfig({displayName:"elements__Buttons",componentId:"sc-11ir6fi-2"})(S()),z=E.default.div.withConfig({displayName:"elements__PickerWrapper",componentId:"sc-11ir6fi-3"})(I()),B=t("../common/lib/templates/index.js"),W=t.n(B),A=t("../common/lib/utils/url-generator.js"),L=t("./src/app/componentConnectors.ts"),R=t("../../node_modules/react-icons/lib/fa/eye.js"),U=t.n(R),F=t("../../node_modules/react-icons/lib/fa/github.js"),H=t.n(F),J=t("../common/lib/utils/animation/fade-in.js"),G=t.n(J);function q(){var e=w()(["\n  width: 100%;\n"]);return q=function(){return e},e}function K(){var e=w()(["\n  display: flex;\n  align-items: center;\n"]);return K=function(){return e},e}function Q(){var e=w()(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 0.875em;\n  color: rgba(255, 255, 255, 0.5);\n  margin-top: 1rem;\n"]);return Q=function(){return e},e}function V(){var e=w()(["\n  width: 30px;\n  border-radius: 50%;\n  margin-right: 0.5rem;\n"]);return V=function(){return e},e}function X(){var e=w()(["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  align-items: center;\n  font-weight: 600;\n  z-index: 0;\n\n  font-size: 1.125rem;\n  color: rgba(255, 255, 255, 0.6);\n"]);return X=function(){return e},e}function Y(){var e=w()(["\n  display: flex;\n  align-items: center;\n  font-weight: bold;\n  margin-bottom: 1rem;\n"]);return Y=function(){return e},e}function Z(){var e=w()(["\n  position: relative;\n  display: flex;\n  padding: 0.6rem 0.75rem;\n  font-size: 0.875em;\n\n  align-items: center;\n"]);return Z=function(){return e},e}function $(){var e=w()(["\n  background-size: contain;\n  background-position: 50%;\n  background-repeat: no-repeat;\n  width: 100%;\n  z-index: 1;\n"]);return $=function(){return e},e}function ee(){var e=w()(["\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: stretch;\n  height: 160px;\n\n  background-color: rgba(255, 255, 255, 0.1);\n"]);return ee=function(){return e},e}function ne(){var e=w()(["\n  ",";\n  background-color: ",";\n  overflow: hidden;\n  border-radius: 2px;\n  user-select: none;\n\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n"]);return ne=function(){return e},e}var te=E.default.div.withConfig({displayName:"elements__Container",componentId:"pmltl1-0"})(ne(),G()(0),function(e){return e.theme.background}),ae=E.default.div.withConfig({displayName:"elements__SandboxImageContainer",componentId:"pmltl1-1"})(ee()),oe=E.default.div.withConfig({displayName:"elements__SandboxImage",componentId:"pmltl1-2"})($()),re=E.default.div.withConfig({displayName:"elements__SandboxInfo",componentId:"pmltl1-3"})(Z()),ie=E.default.div.withConfig({displayName:"elements__SandboxTitle",componentId:"pmltl1-4"})(Y()),le=E.default.div.withConfig({displayName:"elements__ImageMessage",componentId:"pmltl1-5"})(X()),ce=E.default.img.withConfig({displayName:"elements__Avatar",componentId:"pmltl1-6"})(V()),se=E.default.footer.withConfig({displayName:"elements__Details",componentId:"pmltl1-7"})(Q()),ue=E.default.section.withConfig({displayName:"elements__FlexCenter",componentId:"pmltl1-8"})(K()),me=Object(E.default)(b.Button).withConfig({displayName:"elements__Pick",componentId:"pmltl1-9"})(q()),de=Object(L.d)(function(e){var n=e.author,t=e.description,a=e.git,o=e.id,r=e.picks,s=e.pickSandbox,u=e.screenshotUrl,m=e.template,d=e.title,p=e.viewCount,f=Object(l.useState)(u),b=i()(f,2),g=b[0],x=b[1],h=Object(l.useRef)(null),j=Object(l.useCallback)(function(){return!W()(m).isServer},[m]),y=Object(l.useCallback)(function(){x("/api/v1/sandboxes/".concat(o,"/screenshot.png"))},[o]),v=Object(l.useCallback)(function(){!g&&j()&&(h.current=setTimeout(y,1e3))},[j,y,g]);Object(l.useEffect)(function(){return v(),function(){return clearTimeout(h.current)}},[v]);var k=Object(l.useCallback)(function(){var e=Object(A.sandboxUrl)({id:o});window.open(e,"_blank")},[o]),C=Object(l.useCallback)(function(){return W()(m).isServer?"Container Sandbox":"Generating Screenshot..."},[m]),_=Object(l.useCallback)(function(e){var n=Object(A.profileUrl)(e);window.open(n,"_blank")},[]),w=W()(m);return c.a.createElement("div",{style:{backgroundColor:"transparent",borderRadius:2,padding:2}},c.a.createElement(te,{style:{outline:"none"}},c.a.createElement(ae,{onClick:k,role:"button",tabIndex:0},c.a.createElement(le,null,C()),j()&&c.a.createElement(oe,{style:{backgroundImage:"url(".concat(g,")")}})),c.a.createElement(re,null,c.a.createElement("div",{style:{backgroundColor:w.color(),bottom:0,height:"calc(100% + 34px)",left:0,position:"absolute",top:0,width:2}}),c.a.createElement("div",{style:{flex:1}},c.a.createElement("div",{role:"button",tabIndex:0,onClick:k},c.a.createElement(ie,null,d||o),t),c.a.createElement(se,null,n?c.a.createElement(ue,{onClick:function(){return _(n.username)},role:"button",tabIndex:0},c.a.createElement(ce,{alt:n.username,src:n.avatarUrl}),n.name||n.username):null,c.a.createElement(ue,{onClick:k,role:"button",tabIndex:0},c.a.createElement(U.a,{style:{marginRight:"0.5rem"}}),p),a?c.a.createElement(ue,null,c.a.createElement("a",{href:"https://github.com/".concat(a.username,"/").concat(a.repo),rel:"noopener noreferrer",target:"_blank"},c.a.createElement(H.a,{style:{marginRight:"0.5rem"}}))):null))),c.a.createElement(me,{onClick:function(){return s(o,d,t)},small:!0},r.length?"\u2728 Pick Sandbox again":"\u2728 Pick Sandbox")))});n.default=function(){var e=Object(y.c)(),n=e.state.explore.popularSandboxes,t=e.actions.explore,a=t.pickSandboxModal,r=t.popularSandboxesMounted,p=Object(l.useState)(null),g=i()(p,2),h=g[0],_=g[1],w=Object(l.useState)(!1),E=i()(w,2),O=E[0],I=E[1],S=Object(l.useCallback)(function(e){r({date:e})},[r]);Object(l.useEffect)(function(){S(Object(s.a)(Object(u.a)(new Date,1)))},[S]);var N=Object(l.useCallback)(function(e,n,t){a({details:{description:t,id:e,title:n}})},[a]),D=Object(l.useCallback)(function(e){S(Object(s.a)(new Date(e))),_(e),I(!1)},[S]);return c.a.createElement(j.a,null,c.a.createElement(x.a,{horizontal:1.5,vertical:1.5},c.a.createElement(C.a,{title:"Curator Page"}),c.a.createElement(M,null,"Curator Page"),c.a.createElement(v.a,null,"Here you can choose the sandboxes that go in the explore page"),c.a.createElement(T,null,"Most popular sandboxes in the:",c.a.createElement(b.Button,{onClick:function(){return S(Object(s.a)(Object(u.a)(new Date,1)))},small:!0},"Last Week"),c.a.createElement(b.Button,{onClick:function(){return S(Object(s.a)(Object(m.a)(new Date,1)))},small:!0},"Last Month"),c.a.createElement(b.Button,{onClick:function(){return S(Object(s.a)(Object(m.a)(new Date,6)))},small:!0},"Last 6 Months"),c.a.createElement(b.Button,{onClick:function(){return I(function(e){return!e})},small:!0},h?Object(d.a)(new Date(h),"dd/MM/yyyy"):"Custom"),O?c.a.createElement(z,null,c.a.createElement(f.a,{onDayClick:D,selectedDays:h})):null),n?c.a.createElement(P,null,n.sandboxes.map(function(e){return c.a.createElement(de,o()({key:e.id},e,{pickSandbox:N}))})):c.a.createElement(k.a,{style:{color:"rgba(255, 255, 255, 0.5)",fontWeight:600,marginTop:"2rem",textAlign:"center"},delay:0},"Fetching Sandboxes...")))}}}]);
//# sourceMappingURL=page-curator.986ac020.chunk.js.map