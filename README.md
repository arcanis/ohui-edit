# OhUI-Edit

> Terminal text editor widget

## Features

  - Emacs shortcuts
  - Syntax highlighting
  - Performant text buffer
  - Optimized redraws

## Installation

```
$> npm install --save ohui-edit
```

## Usage

```js
import { Editor } from 'ohui-edit';

let editor = new Editor();
screen.appendChild(editor);

editor.value = `Hello world\n`;
```

Syntax highlighting is provided under the form of TextMate definitions:

```
import { GrammarRegistry }          from 'first-mate';
import { readFileSync }             from 'fs';
import { setupTextmateHighlighter } from 'ohui-edit/textmate';
import { Editor }                   from 'ohui-edit';
import plist                        from 'plist';

let language = plist.parse(readFileSync(`${__dirname}/JavaScriptNext.tmLanguage`).toString());
let theme = plist.parse(readFileSync(`${__dirname}/tron.tmTheme`).toString());

let grammarRegistry = new GrammarRegistry();

let grammar = grammarRegistry.createGrammar(null, language);
grammarRegistry.addGrammar(grammar);

let editor = new Editor();
screen.appendChild(editor);

let highlighter = setupTextmateHighlighter(editor);
highlighter.setGrammar(grammar);
highlighter.setTheme(theme);

editor.value = readFileSync(__filename).toString();
```

## License (MIT)

> **Copyright © 2016 Maël Nison**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
