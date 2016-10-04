import { isFunction } from 'lodash';
import TextBuffer     from 'text-buffer';

export class OhuiTextBuffer {

    constructor(element, textBuffer = new TextBuffer()) {

        this._element = element;
        this._textBuffer = textBuffer;

        for (let property in this._textBuffer) {

            if (!isFunction(this._textBuffer[property]))
                continue;

            if (property in this)
                continue;

            this[property] = (... args) => {
                return this._textBuffer[property](... args);
            };

        }

    }

    setText(text) {

        let doesInvalidateX = this._element.activeStyle.flags.hasAdativeWidth;
        let doesInvalidateY = this._element.activeStyle.flags.hasAdaptiveHeight;

        return this._element.applyElementBoxInvalidatingActions(doesInvalidateX, doesInvalidateY, () => {
            return this._textBuffer.setText(text);
        });

    }

    setTextViaDiff(text) {

        let doesInvalidateX = this._element.activeStyle.flags.hasAdativeWidth;
        let doesInvalidateY = this._element.activeStyle.flags.hasAdaptiveHeight;

        return this._element.applyElementBoxInvalidatingActions(doesInvalidateX, doesInvalidateY, () => {
            return this._textBuffer.setTextViaDiff(text);
        });

    }

    setTextInRange(range, text, options) {

        let ret = this._textBuffer.setTextInRange(range, text, options);

        return ret;

    }

    insert(position, text, options) {

        if (!(position instanceof TextBuffer.Point))
            position = TextBuffer.Point.fromObject(position);

        let sizeY = (text.match(/(\r\n|\r|\n)/g) || []).length;
        let isMultilineOperation = sizeY > 0;

        let doesInvalidateX = this._element.activeStyle.flags.hasAdaptiveWidth;
        let doesInvalidateY = this._element.activeStyle.flags.hasAdaptiveHeight && isMultilineOperation;

        if (doesInvalidateX || doesInvalidateY) {

            return this._element.applyElementBoxInvalidatingActions(doesInvalidateX, doesInvalidateY, () => {
                return this._textBuffer.insert(position, text, options);
            });

        } else {

            let ret = this._textBuffer.insert(position, text, options);

            let dirtyRect = this._element.contentBox.toRect();

            let startingRow = position.row;
            let endingRow = isMultilineOperation ? 0 : dirtyRect.height - startingRow - 1;

            dirtyRect.contractSelf(startingRow, 0, endingRow, 0);
            this._element.prepareRedraw(dirtyRect);

            return ret;

        }

    }

    append(text, options) {

        return this.insert(this._textBuffer.getEndPosition(), text, options);

    }

    delete(range) {

        if (!(range instanceof TextBuffer.Range))
            range = TextBuffer.Range.fromObject(range);

        let isMultilineOperation = range.start.row != range.end.row;

        let doesInvalidateX = this._element.activeStyle.flags.hasAdaptiveWidth;
        let doesInvalidateY = this._element.activeStyle.flags.hasAdaptiveHeight && isMultilineOperation;

        if (doesInvalidateX || doesInvalidateY) {

            return this._element.applyElementBoxInvalidatingActions(doesInvalidateX, doesInvalidateY, () => {
                return this._textBuffer.delete(range);
            });

        } else {

            let ret = this._textBuffer.delete(range);

            let dirtyRect = this._element.contentBox.toRect();

            let startingRow = range.start.row;
            let endingRow = isMultilineOperation ? 0 : dirtyRect.height - startingRow - 1;

            dirtyRect.contractSelf(startingRow, 0, endingRow, 0);
            this._element.prepareRedraw(dirtyRect);

            return ret;

        }

    }

    deleteRow(row) {

        return this.delete(this._textBuffer.rangeForRow(row, true));

    }

    deleteRows(startRow, endRow) {

        let start = this._textBuffer.rangeForRow(startRow, true);
        let end = this._textBuffer.rangeForRow(endRow, true);

        return this.delete([ start.start, end.end ]);

    }

}
