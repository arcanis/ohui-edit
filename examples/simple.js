import { GrammarRegistry }          from 'first-mate';
import { readFileSync }             from 'fs';
import { Screen, Block, borders }   from 'ohui';
import plist                        from 'plist';

import { Editor }                   from '../sources/core';
import { setupEmacsShortcuts }      from '../sources/emacs';
import { setupTextmateHighlighter } from '../sources/textmate';

let language = plist.parse(readFileSync(`${__dirname}/JavaScriptNext.tmLanguage`).toString());
let theme = plist.parse(readFileSync(`${__dirname}/tron.tmTheme`).toString());

let grammarRegistry = new GrammarRegistry();

let grammar = grammarRegistry.createGrammar(null, language);
grammarRegistry.addGrammar(grammar);

let screen = new Screen();

let editor = new Editor({ position: `absolute`, left: 0, top: 0, right: 0, bottom: 0, border: borders.simple() });
screen.appendChild(editor);

setupTextmateHighlighter(editor).setGrammar(grammar).setTheme(theme);
setupEmacsShortcuts(editor);

editor.value = readFileSync(`${__dirname}/simple.js`).toString();
editor.focus();
