!function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="https://codesandbox.io/",t(t.s="../../node_modules/thread-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js?!./src/sandbox/eval/transpilers/svelte/svelte-worker.js")}({"../../node_modules/process/browser.js":function(e,r){var t,n,o=e.exports={};function s(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function a(e){if(t===setTimeout)return setTimeout(e,0);if((t===s||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"===typeof setTimeout?setTimeout:s}catch(e){t=s}try{n="function"===typeof clearTimeout?clearTimeout:i}catch(e){n=i}}();var u,c=[],l=!1,p=-1;function f(){l&&u&&(l=!1,u.length?c=u.concat(c):p=-1,c.length&&h())}function h(){if(!l){var e=a(f);l=!0;for(var r=c.length;r;){for(u=c,c=[];++p<r;)u&&u[p].run();p=-1,r=c.length}u=null,l=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===i||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(r){try{return n.call(null,e)}catch(r){return n.call(this,e)}}}(e)}}function m(e,r){this.fun=e,this.array=r}function v(){}o.nextTick=function(e){var r=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)r[t-1]=arguments[t];c.push(new m(e,r)),1!==c.length||l||a(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=v,o.addListener=v,o.once=v,o.off=v,o.removeListener=v,o.removeAllListeners=v,o.emit=v,o.prependListener=v,o.prependOnceListener=v,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},"../../node_modules/semver/semver.js":function(e,r,t){(function(t){var n;r=e.exports=H,n="object"===typeof t&&t.env&&t.env.NODE_DEBUG&&/\bsemver\b/i.test(t.env.NODE_DEBUG)?function(){var e=Array.prototype.slice.call(arguments,0);e.unshift("SEMVER"),console.log.apply(console,e)}:function(){},r.SEMVER_SPEC_VERSION="2.0.0";var o=256,s=Number.MAX_SAFE_INTEGER||9007199254740991,i=r.re=[],a=r.src=[],u=0,c=u++;a[c]="0|[1-9]\\d*";var l=u++;a[l]="[0-9]+";var p=u++;a[p]="\\d*[a-zA-Z-][a-zA-Z0-9-]*";var f=u++;a[f]="("+a[c]+")\\.("+a[c]+")\\.("+a[c]+")";var h=u++;a[h]="("+a[l]+")\\.("+a[l]+")\\.("+a[l]+")";var m=u++;a[m]="(?:"+a[c]+"|"+a[p]+")";var v=u++;a[v]="(?:"+a[l]+"|"+a[p]+")";var d=u++;a[d]="(?:-("+a[m]+"(?:\\."+a[m]+")*))";var g=u++;a[g]="(?:-?("+a[v]+"(?:\\."+a[v]+")*))";var w=u++;a[w]="[0-9A-Za-z-]+";var y=u++;a[y]="(?:\\+("+a[w]+"(?:\\."+a[w]+")*))";var b=u++,j="v?"+a[f]+a[d]+"?"+a[y]+"?";a[b]="^"+j+"$";var E="[v=\\s]*"+a[h]+a[g]+"?"+a[y]+"?",T=u++;a[T]="^"+E+"$";var N=u++;a[N]="((?:<|>)?=?)";var x=u++;a[x]=a[l]+"|x|X|\\*";var S=u++;a[S]=a[c]+"|x|X|\\*";var $=u++;a[$]="[v=\\s]*("+a[S]+")(?:\\.("+a[S]+")(?:\\.("+a[S]+")(?:"+a[d]+")?"+a[y]+"?)?)?";var M=u++;a[M]="[v=\\s]*("+a[x]+")(?:\\.("+a[x]+")(?:\\.("+a[x]+")(?:"+a[g]+")?"+a[y]+"?)?)?";var _=u++;a[_]="^"+a[N]+"\\s*"+a[$]+"$";var k=u++;a[k]="^"+a[N]+"\\s*"+a[M]+"$";var P=u++;a[P]="(?:^|[^\\d])(\\d{1,16})(?:\\.(\\d{1,16}))?(?:\\.(\\d{1,16}))?(?:$|[^\\d])";var R=u++;a[R]="(?:~>?)";var I=u++;a[I]="(\\s*)"+a[R]+"\\s+",i[I]=new RegExp(a[I],"g");var O=u++;a[O]="^"+a[R]+a[$]+"$";var V=u++;a[V]="^"+a[R]+a[M]+"$";var L=u++;a[L]="(?:\\^)";var A=u++;a[A]="(\\s*)"+a[L]+"\\s+",i[A]=new RegExp(a[A],"g");var C=u++;a[C]="^"+a[L]+a[$]+"$";var U=u++;a[U]="^"+a[L]+a[M]+"$";var q=u++;a[q]="^"+a[N]+"\\s*("+E+")$|^$";var D=u++;a[D]="^"+a[N]+"\\s*("+j+")$|^$";var X=u++;a[X]="(\\s*)"+a[N]+"\\s*("+E+"|"+a[$]+")",i[X]=new RegExp(a[X],"g");var z=u++;a[z]="^\\s*("+a[$]+")\\s+-\\s+("+a[$]+")\\s*$";var G=u++;a[G]="^\\s*("+a[M]+")\\s+-\\s+("+a[M]+")\\s*$";var Z=u++;a[Z]="(<|>)?=?\\s*\\*";for(var B=0;B<35;B++)n(B,a[B]),i[B]||(i[B]=new RegExp(a[B]));function F(e,r){if(r&&"object"===typeof r||(r={loose:!!r,includePrerelease:!1}),e instanceof H)return e;if("string"!==typeof e)return null;if(e.length>o)return null;if(!(r.loose?i[T]:i[b]).test(e))return null;try{return new H(e,r)}catch(t){return null}}function H(e,r){if(r&&"object"===typeof r||(r={loose:!!r,includePrerelease:!1}),e instanceof H){if(e.loose===r.loose)return e;e=e.version}else if("string"!==typeof e)throw new TypeError("Invalid Version: "+e);if(e.length>o)throw new TypeError("version is longer than "+o+" characters");if(!(this instanceof H))return new H(e,r);n("SemVer",e,r),this.options=r,this.loose=!!r.loose;var t=e.trim().match(r.loose?i[T]:i[b]);if(!t)throw new TypeError("Invalid Version: "+e);if(this.raw=e,this.major=+t[1],this.minor=+t[2],this.patch=+t[3],this.major>s||this.major<0)throw new TypeError("Invalid major version");if(this.minor>s||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>s||this.patch<0)throw new TypeError("Invalid patch version");t[4]?this.prerelease=t[4].split(".").map(function(e){if(/^[0-9]+$/.test(e)){var r=+e;if(r>=0&&r<s)return r}return e}):this.prerelease=[],this.build=t[5]?t[5].split("."):[],this.format()}r.parse=F,r.valid=function(e,r){var t=F(e,r);return t?t.version:null},r.clean=function(e,r){var t=F(e.trim().replace(/^[=v]+/,""),r);return t?t.version:null},r.SemVer=H,H.prototype.format=function(){return this.version=this.major+"."+this.minor+"."+this.patch,this.prerelease.length&&(this.version+="-"+this.prerelease.join(".")),this.version},H.prototype.toString=function(){return this.version},H.prototype.compare=function(e){return n("SemVer.compare",this.version,this.options,e),e instanceof H||(e=new H(e,this.options)),this.compareMain(e)||this.comparePre(e)},H.prototype.compareMain=function(e){return e instanceof H||(e=new H(e,this.options)),K(this.major,e.major)||K(this.minor,e.minor)||K(this.patch,e.patch)},H.prototype.comparePre=function(e){if(e instanceof H||(e=new H(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;var r=0;do{var t=this.prerelease[r],o=e.prerelease[r];if(n("prerelease compare",r,t,o),void 0===t&&void 0===o)return 0;if(void 0===o)return 1;if(void 0===t)return-1;if(t!==o)return K(t,o)}while(++r)},H.prototype.inc=function(e,r){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",r);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",r);break;case"prepatch":this.prerelease.length=0,this.inc("patch",r),this.inc("pre",r);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",r),this.inc("pre",r);break;case"major":0===this.minor&&0===this.patch&&0!==this.prerelease.length||this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":0===this.patch&&0!==this.prerelease.length||this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":if(0===this.prerelease.length)this.prerelease=[0];else{for(var t=this.prerelease.length;--t>=0;)"number"===typeof this.prerelease[t]&&(this.prerelease[t]++,t=-2);-1===t&&this.prerelease.push(0)}r&&(this.prerelease[0]===r?isNaN(this.prerelease[1])&&(this.prerelease=[r,0]):this.prerelease=[r,0]);break;default:throw new Error("invalid increment argument: "+e)}return this.format(),this.raw=this.version,this},r.inc=function(e,r,t,n){"string"===typeof t&&(n=t,t=void 0);try{return new H(e,t).inc(r,n).version}catch(o){return null}},r.diff=function(e,r){if(ee(e,r))return null;var t=F(e),n=F(r),o="";if(t.prerelease.length||n.prerelease.length){o="pre";var s="prerelease"}for(var i in t)if(("major"===i||"minor"===i||"patch"===i)&&t[i]!==n[i])return o+i;return s},r.compareIdentifiers=K;var J=/^[0-9]+$/;function K(e,r){var t=J.test(e),n=J.test(r);return t&&n&&(e=+e,r=+r),e===r?0:t&&!n?-1:n&&!t?1:e<r?-1:1}function Q(e,r,t){return new H(e,t).compare(new H(r,t))}function W(e,r,t){return Q(e,r,t)>0}function Y(e,r,t){return Q(e,r,t)<0}function ee(e,r,t){return 0===Q(e,r,t)}function re(e,r,t){return 0!==Q(e,r,t)}function te(e,r,t){return Q(e,r,t)>=0}function ne(e,r,t){return Q(e,r,t)<=0}function oe(e,r,t,n){switch(r){case"===":return"object"===typeof e&&(e=e.version),"object"===typeof t&&(t=t.version),e===t;case"!==":return"object"===typeof e&&(e=e.version),"object"===typeof t&&(t=t.version),e!==t;case"":case"=":case"==":return ee(e,t,n);case"!=":return re(e,t,n);case">":return W(e,t,n);case">=":return te(e,t,n);case"<":return Y(e,t,n);case"<=":return ne(e,t,n);default:throw new TypeError("Invalid operator: "+r)}}function se(e,r){if(r&&"object"===typeof r||(r={loose:!!r,includePrerelease:!1}),e instanceof se){if(e.loose===!!r.loose)return e;e=e.value}if(!(this instanceof se))return new se(e,r);n("comparator",e,r),this.options=r,this.loose=!!r.loose,this.parse(e),this.semver===ie?this.value="":this.value=this.operator+this.semver.version,n("comp",this)}r.rcompareIdentifiers=function(e,r){return K(r,e)},r.major=function(e,r){return new H(e,r).major},r.minor=function(e,r){return new H(e,r).minor},r.patch=function(e,r){return new H(e,r).patch},r.compare=Q,r.compareLoose=function(e,r){return Q(e,r,!0)},r.rcompare=function(e,r,t){return Q(r,e,t)},r.sort=function(e,t){return e.sort(function(e,n){return r.compare(e,n,t)})},r.rsort=function(e,t){return e.sort(function(e,n){return r.rcompare(e,n,t)})},r.gt=W,r.lt=Y,r.eq=ee,r.neq=re,r.gte=te,r.lte=ne,r.cmp=oe,r.Comparator=se;var ie={};function ae(e,r){if(r&&"object"===typeof r||(r={loose:!!r,includePrerelease:!1}),e instanceof ae)return e.loose===!!r.loose&&e.includePrerelease===!!r.includePrerelease?e:new ae(e.raw,r);if(e instanceof se)return new ae(e.value,r);if(!(this instanceof ae))return new ae(e,r);if(this.options=r,this.loose=!!r.loose,this.includePrerelease=!!r.includePrerelease,this.raw=e,this.set=e.split(/\s*\|\|\s*/).map(function(e){return this.parseRange(e.trim())},this).filter(function(e){return e.length}),!this.set.length)throw new TypeError("Invalid SemVer Range: "+e);this.format()}function ue(e){return!e||"x"===e.toLowerCase()||"*"===e}function ce(e,r,t,n,o,s,i,a,u,c,l,p,f){return((r=ue(t)?"":ue(n)?">="+t+".0.0":ue(o)?">="+t+"."+n+".0":">="+r)+" "+(a=ue(u)?"":ue(c)?"<"+(+u+1)+".0.0":ue(l)?"<"+u+"."+(+c+1)+".0":p?"<="+u+"."+c+"."+l+"-"+p:"<="+a)).trim()}function le(e,r,t){for(var o=0;o<e.length;o++)if(!e[o].test(r))return!1;if(r.prerelease.length&&!t.includePrerelease){for(o=0;o<e.length;o++)if(n(e[o].semver),e[o].semver!==ie&&e[o].semver.prerelease.length>0){var s=e[o].semver;if(s.major===r.major&&s.minor===r.minor&&s.patch===r.patch)return!0}return!1}return!0}function pe(e,r,t){try{r=new ae(r,t)}catch(n){return!1}return r.test(e)}function fe(e,r,t,n){var o,s,i,a,u;switch(e=new H(e,n),r=new ae(r,n),t){case">":o=W,s=ne,i=Y,a=">",u=">=";break;case"<":o=Y,s=te,i=W,a="<",u="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(pe(e,r,n))return!1;for(var c=0;c<r.set.length;++c){var l=r.set[c],p=null,f=null;if(l.forEach(function(e){e.semver===ie&&(e=new se(">=0.0.0")),p=p||e,f=f||e,o(e.semver,p.semver,n)?p=e:i(e.semver,f.semver,n)&&(f=e)}),p.operator===a||p.operator===u)return!1;if((!f.operator||f.operator===a)&&s(e,f.semver))return!1;if(f.operator===u&&i(e,f.semver))return!1}return!0}se.prototype.parse=function(e){var r=this.options.loose?i[q]:i[D],t=e.match(r);if(!t)throw new TypeError("Invalid comparator: "+e);this.operator=t[1],"="===this.operator&&(this.operator=""),t[2]?this.semver=new H(t[2],this.options.loose):this.semver=ie},se.prototype.toString=function(){return this.value},se.prototype.test=function(e){return n("Comparator.test",e,this.options.loose),this.semver===ie||("string"===typeof e&&(e=new H(e,this.options)),oe(e,this.operator,this.semver,this.options))},se.prototype.intersects=function(e,r){if(!(e instanceof se))throw new TypeError("a Comparator is required");var t;if(r&&"object"===typeof r||(r={loose:!!r,includePrerelease:!1}),""===this.operator)return t=new ae(e.value,r),pe(this.value,t,r);if(""===e.operator)return t=new ae(this.value,r),pe(e.semver,t,r);var n=(">="===this.operator||">"===this.operator)&&(">="===e.operator||">"===e.operator),o=("<="===this.operator||"<"===this.operator)&&("<="===e.operator||"<"===e.operator),s=this.semver.version===e.semver.version,i=(">="===this.operator||"<="===this.operator)&&(">="===e.operator||"<="===e.operator),a=oe(this.semver,"<",e.semver,r)&&(">="===this.operator||">"===this.operator)&&("<="===e.operator||"<"===e.operator),u=oe(this.semver,">",e.semver,r)&&("<="===this.operator||"<"===this.operator)&&(">="===e.operator||">"===e.operator);return n||o||s&&i||a||u},r.Range=ae,ae.prototype.format=function(){return this.range=this.set.map(function(e){return e.join(" ").trim()}).join("||").trim(),this.range},ae.prototype.toString=function(){return this.range},ae.prototype.parseRange=function(e){var r=this.options.loose;e=e.trim();var t=r?i[G]:i[z];e=e.replace(t,ce),n("hyphen replace",e),e=e.replace(i[X],"$1$2$3"),n("comparator trim",e,i[X]),e=(e=(e=e.replace(i[I],"$1~")).replace(i[A],"$1^")).split(/\s+/).join(" ");var o=r?i[q]:i[D],s=e.split(" ").map(function(e){return function(e,r){return n("comp",e,r),e=function(e,r){return e.trim().split(/\s+/).map(function(e){return function(e,r){n("caret",e,r);var t=r.loose?i[U]:i[C];return e.replace(t,function(r,t,o,s,i){var a;return n("caret",e,r,t,o,s,i),ue(t)?a="":ue(o)?a=">="+t+".0.0 <"+(+t+1)+".0.0":ue(s)?a="0"===t?">="+t+"."+o+".0 <"+t+"."+(+o+1)+".0":">="+t+"."+o+".0 <"+(+t+1)+".0.0":i?(n("replaceCaret pr",i),a="0"===t?"0"===o?">="+t+"."+o+"."+s+"-"+i+" <"+t+"."+o+"."+(+s+1):">="+t+"."+o+"."+s+"-"+i+" <"+t+"."+(+o+1)+".0":">="+t+"."+o+"."+s+"-"+i+" <"+(+t+1)+".0.0"):(n("no pr"),a="0"===t?"0"===o?">="+t+"."+o+"."+s+" <"+t+"."+o+"."+(+s+1):">="+t+"."+o+"."+s+" <"+t+"."+(+o+1)+".0":">="+t+"."+o+"."+s+" <"+(+t+1)+".0.0"),n("caret return",a),a})}(e,r)}).join(" ")}(e,r),n("caret",e),e=function(e,r){return e.trim().split(/\s+/).map(function(e){return function(e,r){var t=r.loose?i[V]:i[O];return e.replace(t,function(r,t,o,s,i){var a;return n("tilde",e,r,t,o,s,i),ue(t)?a="":ue(o)?a=">="+t+".0.0 <"+(+t+1)+".0.0":ue(s)?a=">="+t+"."+o+".0 <"+t+"."+(+o+1)+".0":i?(n("replaceTilde pr",i),a=">="+t+"."+o+"."+s+"-"+i+" <"+t+"."+(+o+1)+".0"):a=">="+t+"."+o+"."+s+" <"+t+"."+(+o+1)+".0",n("tilde return",a),a})}(e,r)}).join(" ")}(e,r),n("tildes",e),e=function(e,r){return n("replaceXRanges",e,r),e.split(/\s+/).map(function(e){return function(e,r){e=e.trim();var t=r.loose?i[k]:i[_];return e.replace(t,function(r,t,o,s,i,a){n("xRange",e,r,t,o,s,i,a);var u=ue(o),c=u||ue(s),l=c||ue(i);return"="===t&&l&&(t=""),u?r=">"===t||"<"===t?"<0.0.0":"*":t&&l?(c&&(s=0),i=0,">"===t?(t=">=",c?(o=+o+1,s=0,i=0):(s=+s+1,i=0)):"<="===t&&(t="<",c?o=+o+1:s=+s+1),r=t+o+"."+s+"."+i):c?r=">="+o+".0.0 <"+(+o+1)+".0.0":l&&(r=">="+o+"."+s+".0 <"+o+"."+(+s+1)+".0"),n("xRange return",r),r})}(e,r)}).join(" ")}(e,r),n("xrange",e),e=function(e,r){return n("replaceStars",e,r),e.trim().replace(i[Z],"")}(e,r),n("stars",e),e}(e,this.options)},this).join(" ").split(/\s+/);return this.options.loose&&(s=s.filter(function(e){return!!e.match(o)})),s=s.map(function(e){return new se(e,this.options)},this)},ae.prototype.intersects=function(e,r){if(!(e instanceof ae))throw new TypeError("a Range is required");return this.set.some(function(t){return t.every(function(t){return e.set.some(function(e){return e.every(function(e){return t.intersects(e,r)})})})})},r.toComparators=function(e,r){return new ae(e,r).set.map(function(e){return e.map(function(e){return e.value}).join(" ").trim().split(" ")})},ae.prototype.test=function(e){if(!e)return!1;"string"===typeof e&&(e=new H(e,this.options));for(var r=0;r<this.set.length;r++)if(le(this.set[r],e,this.options))return!0;return!1},r.satisfies=pe,r.maxSatisfying=function(e,r,t){var n=null,o=null;try{var s=new ae(r,t)}catch(i){return null}return e.forEach(function(e){s.test(e)&&(n&&-1!==o.compare(e)||(o=new H(n=e,t)))}),n},r.minSatisfying=function(e,r,t){var n=null,o=null;try{var s=new ae(r,t)}catch(i){return null}return e.forEach(function(e){s.test(e)&&(n&&1!==o.compare(e)||(o=new H(n=e,t)))}),n},r.minVersion=function(e,r){e=new ae(e,r);var t=new H("0.0.0");if(e.test(t))return t;if(t=new H("0.0.0-0"),e.test(t))return t;t=null;for(var n=0;n<e.set.length;++n){e.set[n].forEach(function(e){var r=new H(e.semver.version);switch(e.operator){case">":0===r.prerelease.length?r.patch++:r.prerelease.push(0),r.raw=r.format();case"":case">=":t&&!W(t,r)||(t=r);break;case"<":case"<=":break;default:throw new Error("Unexpected operation: "+e.operator)}})}if(t&&e.test(t))return t;return null},r.validRange=function(e,r){try{return new ae(e,r).range||"*"}catch(t){return null}},r.ltr=function(e,r,t){return fe(e,r,"<",t)},r.gtr=function(e,r,t){return fe(e,r,">",t)},r.outside=fe,r.prerelease=function(e,r){var t=F(e,r);return t&&t.prerelease.length?t.prerelease:null},r.intersects=function(e,r,t){return e=new ae(e,t),r=new ae(r,t),e.intersects(r)},r.coerce=function(e){if(e instanceof H)return e;if("string"!==typeof e)return null;var r=e.match(i[P]);if(null==r)return null;return F(r[1]+"."+(r[2]||"0")+"."+(r[3]||"0"))}}).call(this,t("../../node_modules/process/browser.js"))},"../../node_modules/thread-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js?!./src/sandbox/eval/transpilers/svelte/svelte-worker.js":function(e,r,t){"use strict";t.r(r);var n=t("../../node_modules/semver/semver.js"),o=t.n(n);function s(e){return{name:e.name,message:e.message,fileName:e.fileName,lineNumber:e.lineNumber,columnNumber:e.columnNumber}}function i(e,r){return{message:e.message,columnNumber:e.columnNumber,lineNumber:e.lineNumber,fileName:e.fileName,name:e.name,source:r}}self.window=self,self.postMessage("ready"),self.addEventListener("message",function(e){var r=e.data,t=r.code,n=r.path,a=r.version,u="";o.a.satisfies(a,"1.x")&&(u=function(e,r,t){return self.importScripts(["https://unpkg.com/svelte@".concat(r,"/compiler/svelte.js")]),self.svelte.compile(e,{filename:t,dev:!0,cascade:!1,store:!0,onerror:function(e){self.postMessage({type:"error",error:s(e)})},onwarn:function(e){self.postMessage({type:"warning",warning:i({fileName:e.fileName,lineNumber:e.loc&&e.loc.line,columnNumber:e.loc&&e.loc.column,message:e.message},"svelte")})}})}(t,a,n)),o.a.satisfies(a,"2.x")&&(u=function(e,r,t){self.importScripts(["https://unpkg.com/svelte@".concat(r,"/compiler/svelte.js")]),self.postMessage({type:"clear-warnings",path:t,source:"svelte"});var n=self.svelte.compile(e,{filename:t,dev:!0,cascade:!1,store:!0,onerror:function(e){self.postMessage({type:"error",error:s(e)})},onwarn:function(e){self.postMessage({type:"warning",warning:i({fileName:e.fileName,lineNumber:e.loc&&e.loc.line,columnNumber:e.loc&&e.loc.column,message:e.message},"svelte")})}}).js;return{code:n.code,map:n.map}}(t,a,n)),o.a.satisfies(a,"3.x")&&(u=function(e,r,t){self.importScripts(["https://unpkg.com/svelte@".concat(r,"/compiler.js")]);try{var n=self.svelte.compile(e,{filename:t,dev:!0}),o=n.js,a=n.warnings;return self.postMessage({type:"clear-warnings",path:t,source:"svelte"}),a.forEach(function(e){self.postMessage({type:"warning",warning:i({fileName:e.fileName,lineNumber:e.start&&e.start.line,columnNumber:e.start&&e.start.column,message:e.message},"svelte")})}),o}catch(u){return self.postMessage({type:"error",error:s(u)})}}(t,a,n));var c=u,l=c.code,p=c.map,f="".concat(l,"\n  //# sourceMappingURL=").concat(p.toUrl());self.postMessage({type:"result",transpiledCode:f})})}});
//# sourceMappingURL=svelte-transpiler.6e4355cf.worker.js.map