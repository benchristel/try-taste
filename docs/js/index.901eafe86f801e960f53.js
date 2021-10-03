"use strict";(self.webpackChunktry_taste=self.webpackChunktry_taste||[]).push([[826],{933:(t,n,e)=>{e.d(n,{Ry:()=>f,l_:()=>l,HL:()=>L,is:()=>m,ci:()=>D});const r=Symbol(),o=Symbol(),s=Symbol(),u=Symbol();function c(t,n){function e(...n){if(n.length>=t.length)return t(...n);{const c=(...t)=>e(...n,...t);return c[r]=t,c[o]=e,c[s]=n,c[u]=e[u],c}}return e[r]=t,e[o]=e,e[s]=[],e[u]=n||_(t),e}function i(t){return t[r]}function a(t){return t[s]||[]}function _(t){return t[u]||t.name}function f(){const t=[];return{test:function(n,e){t.push(...Object.entries(e).map((([t,e])=>function(t,n,e){return{subject:t,scenario:n,fn:e}}(n,t,e))))},getAllTests:function(){return t}}}function l(t,n,...e){const r=n(...e,t);if("function"==typeof r)throw new Error("The matcher function `"+w(r)+"` returned a function instead of a boolean. You might need to pass another argument to it.");if(!r)throw new p([t,n,...e])}class p extends Error{constructor(t){super("Expectation failed"),this.expectArgs=t}}function g(t){return t[0]}const h=c((function(t,n){return t(n)}),"which"),d=c((function(t,n){if((e=t)instanceof Function&&function(t){return t[o]}(e)===h&&1===a(e).length)return t(n);var e;if(Array.isArray(t)&&Array.isArray(n))return t.length===n.length&&t.every(((e,r)=>d(t[r],n[r])));if(t instanceof Function&&n instanceof Function)return i(t)&&i(t)===i(n)?d(a(t),a(n)):t===n;if(t instanceof Date&&n instanceof Date)return t.toISOString()===n.toISOString();if(t instanceof Object&&n instanceof Object){const e=Object.keys(t),r=Object.keys(n);return e.length===r.length&&e.every((e=>d(t[e],n[e])))&&t.__proto__.constructor===n.__proto__.constructor}return t===n}),"equals"),m=c((function(t,n){return t===n}),"is"),b=(c((function(t,n,...e){return!t(n,...e)}),"not"),c((function(t){return/^\s*$/.test(t)}),"isBlank"));function w(t){return _(t)||"<function>"}function y(t){const n=[];return e(t);function e(t){return null===t?"null":"function"==typeof t?r(t,o):"string"==typeof t?O(t):"bigint"==typeof t?`${t}n`:Array.isArray(t)?r(t,s):t instanceof Date?`Date(${t.toISOString().replace("T"," ").replace("Z"," UTC")})`:t instanceof RegExp?String(t):t instanceof Error?`${j(t)}(${O(t.message)})`:t&&Object===t.__proto__.constructor?r(t,u):"object"==typeof t?`${j(t)} ${r(t,u)}`:String(t)}function r(t,e){if(n.indexOf(t)>-1)return"<circular reference>";n.push(t);const r=e(t);return n.pop(),r}function o(t){const n=a(t).map(e),r=w(t);return n.length?x(r+"(",n,",",")"):r}function s(t){return x("[",t.map(e),",","]")}function u(t){return x("{",Object.entries(t).map((([t,n])=>`${function(t){return/^[a-zA-Z0-9_$]+$/.test(t)?t:O(t)}(t)}: ${e(n)}`)),",","}")}}function j(t){return w(t.__proto__.constructor)}function O(t){return'"'+String(t).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/"/g,'\\"').replace(/[\x00-\x1f\x7f]/g,k)+'"'}function k(t){const n=t.charCodeAt(0).toString(16);return"\\x"+(n.length<2?"0"+n:n)}function E(t,n){return n.split("\n").map((n=>n?T(Array(t+1).join(" "))(n):n)).join("\n")}const T=t=>n=>t+n,A=c((function(t,n){return n.slice(0,t.length)===t?n.slice(t.length):n}));function x(t,n,e,r){return n.length<2?t+n.join("")+r:t+"\n"+E(2,n.join(e+"\n"))+"\n"+r}async function D(t){const n=[];for(const e of t){const t=await $(e.fn),r=P.map((t=>({type:"debug",args:t})));P.length=0,n.push({test:e,error:t,instrumentLog:r})}return{results:n}}function $(t){let n;try{const n=t();if(n instanceof Promise)return new Promise((t=>{n.then((()=>t())).catch(t)}))}catch(t){n=t}return Promise.resolve(n)}const P=[],S=(c((function(t,n){return n instanceof p&&d(t,n.expectArgs)})),"\n\n");function L({results:t}){let n=!1,e=!1,r=[];for(const o of t){let t=!1;o.error&&(t=n=!0),o.instrumentLog.length&&(t=e=!0),t&&r.push(o)}return n?r.map(M).join(S)+S+"Tests failed.":e?(o=t.length,r.map(M).join(S)+S+function(t){switch(t){case 1:return"The test passed";case 2:return"Both tests passed";default:return`All ${t} tests passed`}}(o)+", but debugging instrumentation is present.\nRemove it before shipping."):function(t){switch(t){case 0:return"No tests to run.";case 1:return"One test ran, and found no issues.";default:return`${t} tests ran, and found no issues.`}}(t.length);var o}function M({test:t,error:n,instrumentLog:e}){const r=[t.subject+" "+t.scenario];return e.length&&r.push(E(2,e.map((({args:t})=>v("debug",t))).join(""))),n&&r.push(E(2,function(t){return t instanceof p?function(t){return v("expect",t.expectArgs)}(t):function(t){return y(t)+" thrown"+E(2,function(t){if(!t)return"";const n=function(t){const n=function(t){return String(t).split(/\r?\n/)}(t);var e;b(g(n))&&n.shift(),b((e=n)[e.length-1])&&n.pop();const r=/^[ \t]*/.exec(g(n))[0];return n.map(A(r)).join("\n")}(t).split("\n");return"\n"+n.slice(0,function(t){const n=t.findIndex((t=>t.includes("errorFrom")));return-1===n?t.length:n}(n)).map((t=>t.replace(/(file:\/\/|http:\/\/[^/]*)/,"").replace(/^([^@]*)@(.*)$/,"at $1 ($2)"))).join("\n")}(t.stack))}(t)}(n))),r.join("\n")}function v(t,n){return x(t+"(",n.map(y),",",")")}Object.freeze({test:{subject:"a thing",scenario:"does something",fn(){}},error:void 0,instrumentLog:[]})},692:(__unused_webpack_module,__unused_webpack___webpack_exports__,__webpack_require__)=>{var _snowpack_pkg_benchristel_taste_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(933);const textarea=document.getElementById("editor"),editor=window.CodeMirror.fromTextArea(textarea,{mode:"javascript"}),output=document.getElementById("output");async function getTestResults(code){const suite=(0,_snowpack_pkg_benchristel_taste_js__WEBPACK_IMPORTED_MODULE_0__.Ry)();return window.test=suite.test,window.expect=_snowpack_pkg_benchristel_taste_js__WEBPACK_IMPORTED_MODULE_0__.l_,window.is=_snowpack_pkg_benchristel_taste_js__WEBPACK_IMPORTED_MODULE_0__.is,eval("(function() {"+code+"})()"),await(0,_snowpack_pkg_benchristel_taste_js__WEBPACK_IMPORTED_MODULE_0__.ci)(suite.getAllTests())}async function runTestsAndDisplayOutput(){try{const t=await getTestResults(editor.getValue());output.innerText=(0,_snowpack_pkg_benchristel_taste_js__WEBPACK_IMPORTED_MODULE_0__.HL)(t),console.log("results")}catch(t){output.innerText=t.message,console.log("error",t,output)}}let debounceTimeout=null;window.addEventListener("keyup",(function(){window.clearTimeout(debounceTimeout),debounceTimeout=window.setTimeout(runTestsAndDisplayOutput,300)})),runTestsAndDisplayOutput()}},t=>{t(t.s=692)}]);