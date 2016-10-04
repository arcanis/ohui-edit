import { style }                    from '@manaflair/term-strings';
import { Block, Point, TermString } from 'ohui';
import { isNull, merge }            from 'lodash';
import TextBuffer                   from 'text-buffer';

import { OhuiTextBuffer }           from './OhuiTextBuffer';
import * as actions                 from './actions';

export class Editor extends Block {

    constructor(style) {

        super(merge({
            minHeight: 1,
            focusable: true
        }, style));

        this.textBuffer = new OhuiTextBuffer(this);

        this.caret = new Point();
        this.caretMaxX = 0;

        this.lineTransformer = null;

        Object.defineProperty(this, `value`, {
            get: () => { return this.getValue(); },
            set: value => { this.setValue(value) }
        });

        this.addEventListener(`data`, ({ setDefault, data }) => {
            if (!isNull(data)) {
                setDefault(() => {
                    this.insert(String(data));
                });
            }
        });

        this.actions = Object.assign({}, ... Object.entries(actions).map(([ name, fn ]) => ({
            [name]: fn.bind(this)
        })));

    }

    setupEditorShortcuts(shortcuts) {

        for (let [ shortcut, [ action, ... args ] ] of Object.entries(shortcuts)) {

            this.addShortcutListener(shortcut, ({ setDefault }) => {
                setDefault(() => {
                    this.actions[action](... args);
                });
            });

        }

    }

    getValue() {

        return this.textBuffer.getText();

    }

    setValue(value) {

        return this.applyElementBoxInvalidatingActions(false, true, () => {
            this.textBuffer.setText(value);
        });

    }

    moveX(x, limit = false) {

        let characterIndex = this.textBuffer.characterIndexForPosition([ this.caret.y, this.caret.x ]);
        let targetPosition = this.textBuffer.positionForCharacterIndex(characterIndex + x);

        if (limit) {

            if (targetPosition.row < this.caret.y) {
                targetPosition = this.textBuffer.rangeForRow(this.caret.y, false).start;
            } else if (targetPosition.row > this.caret.y) {
                targetPosition = this.textBuffer.rangeForRow(this.caret.y, false).end;
            }

        }

        this.caret.x = targetPosition.column;
        this.caret.y = targetPosition.row;

        this.caretMaxX = this.caret.x;

        this.prepareRedraw(null);

    }

    moveY(y) {

        this.caret.y = Math.max(0, Math.min(this.caret.y + y, this.textBuffer.getLineCount() - 1));

        let lineRange = this.textBuffer.rangeForRow(this.caret.y, false);

        this.caret.x = Math.min(this.caretMaxX, lineRange.end.column);

        this.prepareRedraw(null);

    }

    insert(data) {

        let text = String(data);

        let sizeY = (text.match(/(\r\n|\r|\n)/g) || []).length;
        let sizeX = sizeY > 0 ? text.replace(/^.*(\r\n|\r|\n)/, ``).length : text.length;

        this.textBuffer.insert([ this.caret.y, this.caret.x ], text);

        this.caret.x = sizeY > 0 ? sizeX : this.caret.x + sizeX;
        this.caret.y += sizeY;

        this.prepareRedraw(null);

    }

    erase(size) {

        let startingPoint = new TextBuffer.Point(this.caret.y, this.caret.x);
        let startingCharacterIndex = this.textBuffer.characterIndexForPosition(startingPoint);

        let endingCharacterIndex = startingCharacterIndex + size;
        let endingPoint = this.textBuffer.positionForCharacterIndex(endingCharacterIndex);

        this.textBuffer.delete([ startingPoint, endingPoint ]);

        if (endingPoint.row < startingPoint.row || (endingPoint.row === startingPoint.row && endingPoint.column < startingPoint.column)) {
            this.caret.x = endingPoint.column;
            this.caret.y = endingPoint.row;
        }

        this.prepareRedraw(null);

    }

    renderContent(x, y, l) {

        let text = ``;

        if (y < this.textBuffer.getLineCount()) {

            if (isNull(this.lineTransformer)) {

                let start = new TextBuffer.Point(y, x);
                let end = new TextBuffer.Point(y, x + l);

                let range = new TextBuffer.Range(start, end);

                text = this.textBuffer.getTextInRange(range);
                text = text.substr(x, l);

            } else {

                text = this.lineTransformer(y, this.textBuffer.lineForRow(y));
                text = new TermString(text.substr(x, l)).push(style.clear, true);

            }

        }

        return text;

    }

}
