import {basicSetup} from "codemirror"
import {EditorState} from "@codemirror/state"
import {EditorView, keymap} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {javascript} from "@codemirror/lang-javascript"
import {
  createSuite,
  runTests,
  formatTestResultsAsText,
} from "@benchristel/taste"
import * as taste from "@benchristel/taste"

import "./layout.css"
import "./editor.css"
import "./output.css"

const initialCode = `// This is a hacky demo of the Taste testing library.
// Test results appear on the right ----> and update as you edit this code.
// For more information, see https://npmjs.org/package/@benchristel/taste

test("reverse", {
  "does nothing to the empty string"() {
    expect(reverse(""), is, "")
  },

  "does nothing to a one-character string"() {
    expect(reverse("a"), is, "a")
  },

  "flips two characters"() {
    expect(reverse("ab"), is, "ba")
  },

  "reverses 3 characters"() {
    expect(reverse("bad"), is, "dab")
  },

  "reverses 4 characters"() {
    expect(reverse("help"), is, "pleh")
  },
})

function reverse(s) {
  if (!s.length) return ""
  const [head, ...tail] = s
  return reverse(tail) + head
}
`

const editorView = new EditorView({
  doc: initialCode,
  extensions: [basicSetup, keymap.of([indentWithTab]), javascript()],
  parent: document.querySelector("#editor-container"),
})

const output = document.querySelector("#output")

editorView.dom.addEventListener("keyup", (e) => {
  runCode(e.target.innerText)
})

function runCode(code) {
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
    runTests(suite.getAllTests())
      .then(formatTestResultsAsText)
      .then((results) => (output.innerText = results))
    output.innerText = "Running code..."
  } catch (e) {
    output.innerText = e.message
  }
}

runCode(initialCode)
