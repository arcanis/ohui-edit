import { style }                             from '@manaflair/term-strings';
import { isNil, isNull, isUndefined, merge } from 'lodash';
import { TermString }                        from 'ohui';

export function setupTextmateHighlighter(editor) {

    let currentTheme = null;
    let currentGrammar = null;

    let themeCache = new Map();
    let allLinesData = [];

    let getScopesSettings = scopes => {

        if (isNull(currentTheme))
            return {};

        return merge({}, ... currentTheme.settings.filter(({ scope }) => {
            return isNil(scope) || scopes.some(other => other.startsWith(scope));
        }).map(({ settings }) => {
            return settings;
        }));

    };

    let getScopesAddons = scopes => {

        let key = scopes.join(`\n`);
        let addons = themeCache.get(key);

        if (!isUndefined(addons))
            return addons;

        let settings = getScopesSettings(scopes);

        let prefix = new TermString();
        let suffix = new TermString();

        if (settings.foreground) {
            prefix = prefix.push(style.front(settings.foreground), true);
            suffix = suffix.push(style.front.out, true);
        }

        if (settings.background) {
            prefix = prefix.push(style.back(settings.background), true);
            suffix = suffix.push(style.back.out, true);
        }

        addons = { prefix, suffix };
        themeCache.set(key, addons);

        return addons;

    };

    let refreshLine = (line) => {

        if (!isNull(currentGrammar) && !isNull(currentTheme)) {
            return currentGrammar.tokenizeLine(editor.textBuffer.lineForRow(line));
        } else {
            return null;
        }

    };

    let refreshRange = (oldRange, newRange) => {

        let oldAffectedLineCount = oldRange.end.row - oldRange.start.row + 1;
        let newAffectedLineCount = newRange.end.row - newRange.start.row + 1;

        let newlyComputedLines = new Array(newAffectedLineCount);

        for (let t = 0; t < newAffectedLineCount; ++t)
            newlyComputedLines[t] = refreshLine(newRange.start.row + t);

        allLinesData.splice(oldRange.start.row, oldAffectedLineCount, ... newlyComputedLines);

    };

    let updateEditorSettings = () => {

        let scopes = [];

        if (!isNull(currentGrammar))
            scopes.push(currentGrammar.scopeName);

        let grammarSettings = getScopesSettings(scopes);

        if (grammarSettings.background) {
            editor.setStyleProperty(`backgroundColor`, grammarSettings.background);
        }

    };

    editor.textBuffer.onDidChange(({ oldRange, newRange }) => {

        refreshRange(oldRange, newRange);

    });

    editor.lineTransformer = (line, text) => {

        let lineData = allLinesData[line];

        let tokens = currentGrammar.registry.decodeTokens(text, lineData.tags);

        let output = new TermString();

        for (let token of tokens) {
            let { prefix, suffix } = getScopesAddons(token.scopes);
            output = output.push(prefix).push(token.value).push(suffix);
        }

        //return JSON.stringify(output.toString());

        return output;

    };

    return {

        setTheme(theme) {

            currentTheme = theme;
            themeCache = new Map();

            updateEditorSettings();
            refreshRange(editor.textBuffer.getRange(), editor.textBuffer.getRange());

            return this;

        },

        setGrammar(grammar) {

            currentGrammar = grammar;

            updateEditorSettings();
            refreshRange(editor.textBuffer.getRange(), editor.textBuffer.getRange());

            return this;

        }

    };

}
