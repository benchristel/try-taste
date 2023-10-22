(function(){"use strict";const originalFunctionKey=Symbol(),curriedFunctionKey=Symbol(),partialArgsKey=Symbol(),nameKey=Symbol();function curry(t,e){function n(...i){if(i.length>=t.length)return t(...i);{const o=(...s)=>n(...i,...s);return o[originalFunctionKey]=t,o[curriedFunctionKey]=n,o[partialArgsKey]=i,o[nameKey]=n[nameKey],o}}return n[originalFunctionKey]=t,n[curriedFunctionKey]=n,n[partialArgsKey]=[],n[nameKey]=e||functionName(t),n}function originalFunction(t){return t[originalFunctionKey]}function curriedFunction(t){return t[curriedFunctionKey]}function partialArgs(t){return t[partialArgsKey]||[]}function functionName(t){return t[nameKey]||t.name}function createSuite$1(){const t=[];return{test:e,getAllTests:n};function e(i,o){t.push(...Object.entries(o).map(([s,a])=>TestCase(i,s,a)))}function n(){return t}}function expect(t,e,...n){const i=e(...n,t);if(typeof i=="function")throw new Error("The matcher function `"+prettyFunctionName(i)+"` returned a function instead of a boolean. You might need to pass another argument to it.");if(!i)throw new ExpectationFailure([t,e,...n])}function TestCase(t,e,n){return{subject:t,scenario:e,fn:n}}class ExpectationFailure extends Error{constructor(e){super("Expectation failed"),this.expectArgs=e}}function lastOf(t){return t[t.length-1]}function firstOf(t){return t[0]}const which=curry(function(t,e){return t(e)},"which"),equals=curry(function(t,e){var n,i;if(isCustomMatcher(t))return t(e);if(Array.isArray(t)&&Array.isArray(e))return t.length===e.length&&t.every((o,s)=>equals(t[s],e[s]));if(t instanceof Function&&e instanceof Function)return originalFunction(t)&&originalFunction(t)===originalFunction(e)?equals(partialArgs(t),partialArgs(e)):t===e;if(t instanceof Date&&e instanceof Date)return t.toISOString()===e.toISOString();if(t instanceof Set&&e instanceof Set)return t.size===e.size&&[...t.values()].every(o=>e.has(o));if(t instanceof Error&&e instanceof Error)return t.message===e.message&&t.__proto__.constructor===e.__proto__.constructor;if(isObject(t)&&isObject(e)){const o=Object.keys(t),s=Object.keys(e);return o.length===s.length&&o.every(a=>equals(t[a],e[a]))&&((n=t.__proto__)==null?void 0:n.constructor)===((i=e.__proto__)==null?void 0:i.constructor)}return t===e},"equals"),is=curry(function(t,e){return t===e},"is"),not=curry(function(t,e,...n){return!t(e,...n)},"not"),isBlank=curry(function(t){return/^\s*$/.test(t)},"isBlank");function isObject(t){return!!t&&typeof t=="object"}function isCustomMatcher(t){return t instanceof Function&&curriedFunction(t)===which&&partialArgs(t).length===1}function prettyFunctionName(t){return functionName(t)||"<function>"}function pretty(t){const e=[];return n(t);function n(r){var u;if(r===null)return"null";if(typeof r=="function")return i(r,o);if(typeof r=="string")return quote(r);if(typeof r=="bigint")return`${r}n`;if(Array.isArray(r))return i(r,s);if(r instanceof Date)return`Date(${r.toISOString().replace("T"," ").replace("Z"," UTC")})`;if(r instanceof RegExp)return String(r);if(r instanceof Error)return`${prettyConstructor(r)}(${quote(r.message)})`;if(r instanceof Set)return i(r,f);if(typeof r=="object"){const c=(u=r==null?void 0:r.__proto__)==null?void 0:u.constructor;return c===Object||!c?i(r,a):`${prettyConstructor(r)} ${i(r,a)}`}return String(r)}function i(r,u){if(e.indexOf(r)>-1)return"<circular reference>";e.push(r);const c=u(r);return e.pop(),c}function o(r){const u=partialArgs(r).map(n),c=prettyFunctionName(r);return u.length?formatStructure(c+"(",u,",",")"):c}function s(r){return formatStructure("[",r.map(n),",","]")}function a(r){const u=Object.entries(r).map(([c,l])=>`${prettyKey(c)}: ${n(l)}`);return formatStructure("{",u,",","}")}function f(r){const u=[...r.values()].map(n);return formatStructure("Set {",u,",","}")}}function prettyKey(t){return/^[a-zA-Z0-9_$]+$/.test(t)?t:quote(t)}function prettyConstructor(t){return prettyFunctionName(t.__proto__.constructor)}function quote(t){return'"'+String(t).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/"/g,'\\"').replace(/[\x00-\x1f\x7f]/g,hexEscape)+'"'}function hexEscape(t){const e=t.charCodeAt(0).toString(16);return"\\x"+(e.length<2?"0"+e:e)}function indent(t,e){return e.split(`
`).map(n=>n&&prepend(repeat(t," "))(n)).join(`
`)}function repeat(t,e){return Array(t+1).join(e)}const prepend=t=>e=>t+e,removePrefix=curry(function(e,n){return n.slice(0,e.length)===e?n.slice(e.length):n});function lines(t){return String(t).split(/\r?\n/)}function trimMargin(t){const e=lines(t);isBlank(firstOf(e))&&e.shift(),isBlank(lastOf(e))&&e.pop();const n=/^[ \t]*/.exec(firstOf(e))[0];return e.map(removePrefix(n)).join(`
`)}function formatStructure(t,e,n,i){return e.length<2?t+e.join("")+i:t+`
`+indent(2,e.join(n+`
`))+`
`+i}async function runTests$1(t){const e=[];for(const n of t){const i=await errorFrom(n.fn),o=debugLogs.map(s=>({type:"debug",args:s}));debugLogs.length=0,e.push({test:n,error:i,instrumentLog:o})}return{results:e}}function errorFrom(t){let e;try{const n=t();if(n instanceof Promise)return new Promise(i=>{n.then(()=>i()).catch(i)})}catch(n){e=n}return Promise.resolve(e)}const debugLogs=[];function debug(...t){debugLogs.push(t)}curry(function(e,n){return n instanceof ExpectationFailure&&equals(e,n.expectArgs)});const blankLine=`

`;function formatTestResultsAsText$1({results:t}){let e=!1,n=!1,i=[];for(const o of t){let s=!1;o.error&&(s=e=!0),o.instrumentLog.length&&(s=n=!0),s&&i.push(o)}return e?suiteFailed(i):n?suitePassedWithInstrumentation(t.length,i):suitePassed(t.length)}function reportsFailure(t){return/fail/i.test(t)}function suiteFailed(t){return t.map(formatFailure).join(blankLine)+blankLine+"Tests failed."}function suitePassed(t){switch(t){case 0:return"No tests to run.";case 1:return"One test ran, and found no issues.";default:return`${t} tests ran, and found no issues.`}}function suitePassedWithInstrumentation(t,e){return e.map(formatFailure).join(blankLine)+blankLine+countPasses(t)+`, but debugging instrumentation is present.
Remove it before shipping.`}function countPasses(t){switch(t){case 1:return"The test passed";case 2:return"Both tests passed";default:return`All ${t} tests passed`}}function formatFailure({test:t,error:e,instrumentLog:n}){const o=[t.subject+" "+t.scenario];return n.length&&o.push(indent(2,formatDebugLog(n))),e&&o.push(indent(2,formatError(e))),o.join(`
`)}function formatError(t){return t instanceof ExpectationFailure?formatExpectationFailure(t):formatException(t)}function formatDebugLog(t){return t.map(({args:e})=>formatFunctionCall("debug",e)).join("")}function formatExpectationFailure(t){return formatFunctionCall("expect",t.expectArgs)}function formatException(t){return pretty(t)+" thrown"+indent(2,simplifyStacktrace(t.stack))}function formatFunctionCall(t,e){return formatStructure(t+"(",e.map(pretty),",",")")}function simplifyStacktrace(t){if(!t)return"";const e=trimMargin(t).split(`
`);return`
`+e.slice(0,indexOfFirstIrrelevantStackFrame(e)).map(n=>n.replace(/(file:\/\/|http:\/\/[^/]*)/,"").replace(/^([^@]*)@(.*)$/,"at $1 ($2)")).join(`
`)}function indexOfFirstIrrelevantStackFrame(t){const e=t.findIndex(n=>n.includes("errorFrom"));return e===-1?t.length:e}Object.freeze({test:{subject:"a thing",scenario:"does something",fn(){}},error:void 0,instrumentLog:[]}),console.log("worker loaded");async function runCode(code){globalThis.createSuite=createSuite$1,globalThis.runTests=runTests$1,globalThis.formatTestResultsAsText=formatTestResultsAsText$1,globalThis.expect=expect,globalThis.is=is,globalThis.not=not,globalThis.equals=equals,globalThis.which=which,globalThis.debug=debug,globalThis.curry=curry,globalThis.reportsFailure=reportsFailure;const suite=createSuite();globalThis.test=suite.test,globalThis.getAllTests=suite.getAllTests;try{return eval(`(() => {${code}})()`),await runTests(suite.getAllTests()).then(formatTestResultsAsText)}catch(t){return t.message||String(t)}}onmessage=({data:t})=>{runCode(t).then(postMessage)}})();