import {basicSetup} from "codemirror"
import {EditorState} from "@codemirror/state"
import {EditorView, keymap} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {javascript} from "@codemirror/lang-javascript"
import debounce from "lodash.debounce"
import {
  createSuite,
  runTests,
  formatTestResultsAsText,
} from "@benchristel/taste"

import "./layout.css"
import "./editor.css"
import "./output.css"

const debounceMillis = 400

const initialCode = `// This is a hacky demo of the Taste testing library.
// Test results appear on the right ----> and update as you edit this code.
// For more information, see https://npmjs.org/package/@benchristel/taste

// NOTE: There is an artificial delay of ${debounceMillis} milliseconds
// before tests run. The tests themselves run very quickly :)

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
  output.innerText = "..."
  runTests(e.target.innerText)
})

const runTests = debounce((code) => {
  output.innerText = "Running..."
  runCodeInWorker(code).then(
    (results) => (output.innerText = results),
  )
}, debounceMillis)

let worker
function runCodeInWorker(code) {
  worker?.terminate()
  worker = new Worker(
    new URL("./test-runner-worker.ts", import.meta.url),
    {type: "module"},
  )
  worker.postMessage(code)
  return new Promise((resolve) => {
    const workerForThisPromise = worker
    worker.addEventListener("message", ({data: results}) => {
      if (worker === workerForThisPromise) {
        resolve(results)
      }
    })
  })
}

runTests(initialCode)
runTests.flush()
