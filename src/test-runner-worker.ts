import * as taste from "@benchristel/taste"

console.log("worker loaded")

async function runCode(code) {
  globalThis.createSuite = taste.createSuite
  globalThis.runTests = taste.runTests
  globalThis.formatTestResultsAsText = taste.formatTestResultsAsText
  globalThis.expect = taste.expect
  globalThis.is = taste.is
  globalThis.not = taste.not
  globalThis.equals = taste.equals
  globalThis.which = taste.which
  globalThis.debug = taste.debug
  globalThis.curry = taste.curry
  globalThis.reportsFailure = taste.reportsFailure

  const suite = createSuite()
  globalThis.test = suite.test
  globalThis.getAllTests = suite.getAllTests

  try {
    eval(`(() => {${code}})()`)
    return await runTests(suite.getAllTests()).then(
      formatTestResultsAsText,
    )
  } catch (e) {
    return e.message || String(e)
  }
}

onmessage = ({data: code}) => {
  runCode(code).then(postMessage)
}
