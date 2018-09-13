import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import memoize from 'lodash.memoize';

//import "brace/mode/text";
import "brace/mode/html";
import "brace/mode/xml";
import 'brace/mode/markdown';
//import "brace/mode/json";
//import 'brace/mode/javascript';
import 'brace/mode/jsx';
import 'brace/mode/typescript';
import 'brace/mode/scss';
import 'brace/mode/less';
import 'brace/mode/css';
import 'brace/mode/java';
import 'brace/mode/jsp';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/mode/php';
import 'brace/mode/sql';
import 'brace/mode/golang';
import 'brace/mode/csharp';
import 'brace/mode/batchfile';
import 'brace/mode/c_cpp';
import 'brace/mode/swift';
import 'brace/mode/scala';
import 'brace/mode/objectivec';
import 'brace/mode/assembly_x86';
import 'brace/mode/lua';
import 'brace/mode/prolog';
import 'brace/mode/rust';
import 'brace/mode/sh';
import 'brace/mode/yaml';
import 'brace/mode/clojure';
import 'brace/mode/elixir';
import 'brace/mode/kotlin';
import 'brace/mode/ocaml';

import 'brace/theme/xcode';

const modeExtensions = {
  text: ['txt'],
  html: ['html', 'htm'],
  xml: ['xml'],
  markdown: ['md'],
  json: ['json'],
  jsx: ['js', 'jsx'],
  typescript: ['ts', 'tsx'],
  scss: ['scss'],
  less: ['less'],
  css: ['css'],
  java: ['java', 'class'],
  jsp: ['jsp'],
  python: ['py', 'pyc', 'pyd', 'pyo', 'pyw', 'pyz'],
  ruby: ['rb'],
  php: ['php'],
  sql: ['sql'],
  golang: ['go'],
  csharp: ['cs'],
  batchfile: ['bat'],
  c_pp: ['c', 'cc', 'cpp', 'cxx', 'c++', 'h', 'hh', 'hpp', 'hxx', 'h++'],
  swift: ['swift'],
  scala: ['scala', 'sc'],
  objectivec: ['h', 'm', 'mm'],
  assembly_x86: ['s', 'asm'],
  lua: ['lua'],
  prolog: ['pl', 'pro', 'p'],
  rust: ['rs', 'rlib'],
  sh: ['sh'],
  yaml: ['yaml'],
  clojure: ['clj', 'cljs', 'cljc', 'edn'],
  elixir: ['ex', 'exs'],
  kotlin: ['kt', 'kts'],
  ocaml: ['ml', 'mli'],
};

const DEFAULT_MODE = 'jsx';

// NOTE: detectedLanguage might not match brace mode
// e.g. "javascript" instead of "jsx"
const detectMode = memoize((filename, detectedLanguage) => {
  filename = (filename || '').trim().toLowerCase();
  detectedLanguage = (detectedLanguage || '').trim().toLowerCase();

  const ext = filename.split('.').slice(-1)[0];
  const extModes = Object.keys(modeExtensions)
    .filter(aMode => modeExtensions[aMode].indexOf(ext) !== -1);

  if (extModes.length === 1) {
    return extModes[0];
  }

  const detectedLanguageIsMode = Object.keys(modeExtensions)
    .indexOf(detectedLanguage) !== -1;
  if (detectedLanguageIsMode) {
    return detectedLanguage;
  }

  return extModes[0] || DEFAULT_MODE;
}, (...args) => JSON.stringify(args));

class CodeEditor extends React.Component {
  static propTypes = {
    filename: PropTypes.string,
    detectedLanguage: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    filename: '',
    detectedLanguage: '',
    value: '',
    onChange: () => {},
  };

  onEditorLoad = (editor) => {
    //editor.renderer.setOption("scrollPastEnd", true);
  };

  render() {
    const mode = detectMode(this.props.filename, this.props.detectedLanguage);

    return (
      <AceEditor
        mode={mode}
        theme="xcode"
        name="codeEditor"
        onLoad={this.onEditorLoad}
        editorProps={{ $blockScrolling: true }}
        value={this.props.value}
        onChange={this.props.onChange}
        debounceChangePeriod={250}
        tabSize={2}
        width="100%"
        height="100%"
      />
    );
  }
}

export default CodeEditor;
