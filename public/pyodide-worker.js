/* eslint-disable no-restricted-globals */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");

let pyodideInstance = null;

async function initPyodide() {
  if (!pyodideInstance) {
    pyodideInstance = await loadPyodide();
  }
  return pyodideInstance;
}

self.onmessage = async function (event) {
  const { id, code } = event.data;

  try {
    const pyodide = await initPyodide();

    // Redirect stdout and stderr to StringIO before running user code
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

    // Run the user's code
    pyodide.runPython(code);

    // Capture stdout and stderr
    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    const stderr = pyodide.runPython("sys.stderr.getvalue()");

    // Reset stdout and stderr
    pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

    const output = stdout + (stderr ? "\n" + stderr : "");
    self.postMessage({ id, output: output || "(No output)" });
  } catch (err) {
    // Reset stdout and stderr on error too
    try {
      if (pyodideInstance) {
        pyodideInstance.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
      }
    } catch (_) {
      // ignore cleanup errors
    }

    self.postMessage({ id, error: err.message || String(err) });
  }
};
