const originalFunctionKey = Symbol();
const curriedFunctionKey = Symbol();
const partialArgsKey = Symbol();
const nameKey = Symbol();

function curry(f, name) {
  function curried(...args) {
    if (args.length >= f.length) {
      return f(...args)
    } else {
      const f2 = (...moreArgs) => curried(...args, ...moreArgs);
      f2[originalFunctionKey] = f;
      f2[curriedFunctionKey] = curried;
      f2[partialArgsKey] = args;
      f2[nameKey] = curried[nameKey];
      return f2
    }
  }

  curried[originalFunctionKey] = f;
  curried[curriedFunctionKey] = curried;
  curried[partialArgsKey] = [];
  curried[nameKey] = name || functionName(f);
  return curried
}

function originalFunction(f) {
  return f[originalFunctionKey]
}

function curriedFunction(f) {
  return f[curriedFunctionKey]
}

function partialArgs(f) {
  return f[partialArgsKey] || []
}

function functionName(f) {
  return f[nameKey] || f.name
}

function createSuite() {
  const testCases = [];

  return {test, getAllTests}

  function test(subject, definitions) {
    testCases.push(
      ...Object.entries(definitions)
        .map(([behavior, fn]) =>
          TestCase(subject, behavior, fn))
    );
  }

  function getAllTests() {
    return testCases
  }
}

function expect(subject, expectation, ...args) {
  const pass = expectation(...args, subject);
  // if the expectation returns a function, that's almost
  // certainly a mistake on the part of the test-writer.
  // Possibly they forgot to pass all needed arguments to
  // a curried function.
  if (typeof pass === "function") {
    throw new Error("The matcher function `" + prettyFunctionName(pass) + "` returned a function instead of a boolean. You might need to pass another argument to it.")
  }
  if (!pass) {
    throw new ExpectationFailure([subject, expectation, ...args])
  }
}

function TestCase(subject, scenario, fn) {
  return {subject, scenario, fn}
}

class ExpectationFailure extends Error {
  constructor(expectArgs) {
    super("Expectation failed");
    this.expectArgs = expectArgs;
  }
}

function lastOf(a) {
  return a[a.length - 1]
}

function firstOf(a) {
  return a[0]
}

const which = curry(function(predicate, x) {
  return predicate(x)
}, "which");

const equals = curry(function(a, b) {
  if (isCustomMatcher(a)) {
    return a(b)
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length
      && a.every((_, i) => equals(a[i], b[i]))
  }
  if (a instanceof Function && b instanceof Function) {
    if (originalFunction(a) && originalFunction(a) === originalFunction(b)) {
      return equals(partialArgs(a), partialArgs(b))
    }
    return a === b
  }
  if (a instanceof Date && b instanceof Date) {
    return a.toISOString() === b.toISOString()
  }
  if (a instanceof Set && b instanceof Set) {
    return a.size === b.size
      && [...a.values()].every(v => b.has(v))
  }
  if (a instanceof Error && b instanceof Error) {
    return a.message === b.message
      && a.__proto__.constructor === b.__proto__.constructor
  }
  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    return aKeys.length === bKeys.length
      && aKeys.every(k => equals(a[k], b[k]))
      && a.__proto__?.constructor === b.__proto__?.constructor
  }
  return a === b
}, "equals");

const is = curry(function(a, b) {
  return a === b
}, "is");

const not = curry(function(predicate, subject, ...args) {
  return !predicate(subject, ...args)
}, "not");

const isBlank = curry(function(s) {
  return /^\s*$/.test(s)
}, "isBlank");

function isObject(x) {
  return !!x && typeof x === "object"
}

function isCustomMatcher(f) {
  return f instanceof Function
    && curriedFunction(f) === which
    && partialArgs(f).length === 1
}

function prettyFunctionName(f) {
  return functionName(f) || "<function>"
}

function pretty(x) {
  const stack = [];
  return _pretty(x)

  function _pretty(x) {
    if (null === x)
      return "null"
    if ("function" === typeof x)
      return preventInfiniteLoop(x, prettyFunction)
    if ("string" === typeof x)
      return quote(x)
    if ("bigint" === typeof x)
      return `${x}n`
    if (Array.isArray(x))
      return preventInfiniteLoop(x, prettyArray)
    if (x instanceof Date)
      return `Date(${x.toISOString().replace("T", " ").replace("Z", " UTC")})`
    if (x instanceof RegExp)
      return String(x)
    if (x instanceof Error)
      return `${prettyConstructor(x)}(${quote(x.message)})`
    if (x instanceof Set)
      return preventInfiniteLoop(x, prettySet)
    if ("object" === typeof x) {
      const constructor = x?.__proto__?.constructor;
      if (constructor === Object || !constructor)
        return preventInfiniteLoop(x, prettyObject)
      else
        return `${prettyConstructor(x)} ${preventInfiniteLoop(x, prettyObject)}`
    }
    return String(x)
  }

  function preventInfiniteLoop(x, cb) {
    if (stack.indexOf(x) > -1) return "<circular reference>"
    stack.push(x);
    const result = cb(x);
    stack.pop();
    return result
  }

  function prettyFunction(f) {
    const args = partialArgs(f).map(_pretty);
    const name = prettyFunctionName(f);
    if (!args.length) return name
    return formatStructure(name + "(", args, ",", ")")
  }

  function prettyArray(a) {
    return formatStructure("[", a.map(_pretty), ",", "]")
  }

  function prettyObject(x) {
    const innards = Object.entries(x)
      .map(([k, v]) => `${prettyKey(k)}: ${_pretty(v)}`);
    return formatStructure("{", innards, ",", "}")
  }

  function prettySet(x) {
    const innards = [...x.values()].map(_pretty);
    return formatStructure("Set {", innards, ",", "}")
  }
}

function prettyKey(k) {
  return /^[a-zA-Z0-9_$]+$/.test(k) ? k : quote(k)
}

function prettyConstructor(obj) {
  return prettyFunctionName(obj.__proto__.constructor)
}

function quote(s) {
  return '"' + String(s)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/"/g, '\\"')
    .replace(/[\x00-\x1f\x7f]/g, hexEscape)
    + '"'
}

function hexEscape(c) {
  const hex = c.charCodeAt(0).toString(16);
  return "\\x" + (hex.length < 2 ? "0" + hex : hex)
}

function indent(level, s) {
  return s.split("\n")
    .map(l => !l ? l : prepend(repeat(level, " "))(l))
    .join("\n")
}

function repeat(n, s) {
  return Array(n + 1).join(s)
}

const prepend = prefix => s => prefix + s;

const removePrefix = curry(
  function removePrefix(prefix, s) {
    const hasPrefix = s.slice(0, prefix.length) === prefix;
    return hasPrefix ? s.slice(prefix.length) : s
  });

function lines(s) {
  return String(s).split(/\r?\n/)
}

function trimMargin(s) {
  const lns = lines(s);
  if (isBlank(firstOf(lns))) lns.shift();
  if (isBlank( lastOf(lns))) lns.pop();
  const initialIndent = /^[ \t]*/.exec(firstOf(lns))[0];
  return lns
    .map(removePrefix(initialIndent))
    .join("\n")
}

function formatStructure(prefix, innards, delim, suffix) {
  if (innards.length < 2) {
    return prefix + innards.join("") + suffix
  } else {
    return prefix + "\n"
      + indent(2, innards.join(delim + "\n"))
      + "\n" + suffix
  }
}

async function runTests(tests) {
  const results = [];
  for (const test of tests) {
    const error = await errorFrom(test.fn);
    const instrumentLog = debugLogs.map(args => ({type: "debug", args}));
    debugLogs.length = 0;
    results.push({
      test,
      error,
      instrumentLog
    });
  }
  return {results}
}

// WARNING: if you change the name of errorFrom, you must
// also update the test result formatter, which uses the
// errorFrom name to identify the end of the useful
// stacktrace.
function errorFrom(f) {
  let caught;
  try {
    const result = f();
    if (result instanceof Promise) {
      return new Promise(resolve => {
        result.then(() => resolve()).catch(resolve);
      })
    }
  } catch(e) {
    caught = e;
  }
  return Promise.resolve(caught);
}

const debugLogs = [];
function debug(...args) {
  debugLogs.push(args);
}

const isExpectationFailure = curry(
  function isExpectationFailure(args, error) {
    return error instanceof ExpectationFailure &&
      equals(args, error.expectArgs)
  });

const blankLine = "\n\n";

function formatTestResultsAsText({results}) {
  let anyErrors = false;
  let anyInstrumentation = false;
  let resultsNeedingAttention = [];
  for (const r of results) {
    let needsAttention = false;
    if (r.error) {
      needsAttention = anyErrors = true;
    }
    if (r.instrumentLog.length) {
      needsAttention = anyInstrumentation = true;
    }
    if (needsAttention) {
      resultsNeedingAttention.push(r);
    }
  }
  if (anyErrors) {
    return suiteFailed(resultsNeedingAttention)
  }
  if (anyInstrumentation) {
    return suitePassedWithInstrumentation(
      results.length,
      resultsNeedingAttention,
    )
  }
  return suitePassed(results.length)
}

function reportsFailure(testOutput) {
  return /fail/i.test(testOutput)
}

function suiteFailed(failures) {
  return failures
    .map(formatFailure)
    .join(blankLine)
    + blankLine + "Tests failed."
}

function suitePassed(numPassed) {
  switch (numPassed) {
    case 0: return "No tests to run."
    case 1: return "One test ran, and found no issues."
    default: return `${numPassed} tests ran, and found no issues.`
  }
}

function suitePassedWithInstrumentation(numPassed, resultsWithLogs) {
  return resultsWithLogs
    .map(formatFailure)
    .join(blankLine)
    + blankLine
    + countPasses(numPassed) + ", but debugging instrumentation is present.\n"
    + "Remove it before shipping."
}

function countPasses(n) {
  switch (n) {
    case 1: return "The test passed"
    case 2: return "Both tests passed"
    default: return `All ${n} tests passed`
  }
}

function formatFailure({test, error, instrumentLog}) {
  const title = test.subject + " " + test.scenario;
  const sections = [title];
  if (instrumentLog.length)
    sections.push(indent(2, formatDebugLog(instrumentLog)));
  if (error)
    sections.push(indent(2, formatError(error)));
  return sections.join("\n")
}

function formatError(error) {
  return error instanceof ExpectationFailure
    ? formatExpectationFailure(error)
    : formatException(error)
}

function formatDebugLog(log) {
  return log
    .map(({args}) => formatFunctionCall("debug", args))
    .join("")
}

function formatExpectationFailure(error) {
  return formatFunctionCall(
    "expect",
    error.expectArgs
  )
}

function formatException(error) {
  return pretty(error) + " thrown"
    + indent(2, simplifyStacktrace(error.stack))
}

function formatFunctionCall(name, args) {
  return formatStructure(name + "(", args.map(pretty), ",", ")")
}

function simplifyStacktrace(stack) {
  if (!stack) return ""
  const lines = trimMargin(stack).split("\n");
  return "\n"
    + lines.slice(0, indexOfFirstIrrelevantStackFrame(lines))
      .map(line =>
        line
          .replace(/(file:\/\/|http:\/\/[^/]*)/, "")
          .replace(/^([^@]*)@(.*)$/, "at $1 ($2)")
      )
      .join("\n")
}

function indexOfFirstIrrelevantStackFrame(lines) {
  const i = lines.findIndex(l => l.includes("errorFrom"));
  // If the error is thrown from async code, errorFrom
  // won't be on the stack. In that case, consider all stack
  // frames relevant.
  if (i === -1) return lines.length
  else return i
}

const basePassingTest = Object.freeze({
  test: {
    subject: "a thing",
    scenario: "does something",
    fn() {},
  },
  error: undefined,
  instrumentLog: [],
});

export { createSuite, curry, debug, equals, expect, formatTestResultsAsText, is, not, reportsFailure, runTests, which };
