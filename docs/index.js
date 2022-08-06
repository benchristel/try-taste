import {
  createSuite,
  runTests,
  formatTestResultsAsText,
  expect,
  is,
  not,
  equals,
  which,
  debug,
  curry,
  reportsFailure,
} from "./_snowpack/pkg/@benchristel/taste.js"

const textarea = document.getElementById('editor')
const editor = window.CodeMirror.fromTextArea(textarea, {mode: 'javascript'})
const output = document.getElementById("output")

async function getTestResults(code) {
  const suite = createSuite()
  window.test = suite.test
  window.getAllTests = suite.getAllTests
  window.createSuite = createSuite
  window.runTests = runTests
  window.formatTestResultsAsText = formatTestResultsAsText
  window.expect = expect
  window.is = is
  window.not = not
  window.equals = equals
  window.which = which
  window.debug = debug
  window.curry = curry
  window.reportsFailure = reportsFailure
  eval("(function() {" + code + "})()")
  return await runTests(suite.getAllTests())
}

async function runTestsAndDisplayOutput() {
  try {
    const results = await getTestResults(editor.getValue())
    output.innerText = formatTestResultsAsText(results)
    console.log("results")
  } catch (e) {
    output.innerText = e.message
    console.log("error", e, output)
  }
}


let debounceTimeout = null
window.addEventListener('keyup', function() {
  window.clearTimeout(debounceTimeout)
  debounceTimeout = window.setTimeout(runTestsAndDisplayOutput, 300)
})

runTestsAndDisplayOutput()
