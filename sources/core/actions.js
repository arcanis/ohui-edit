export function erasePreviousCharacter() {
    this.erase(-1);
}

export function eraseNextCharacter() {
    this.erase(+1);
}

export function moveCaretLeft() {
    this.moveX(-1);
}

export function moveCaretRight() {
    this.moveX(+1);
}

export function moveCaretUp() {
    this.moveY(-1);
}

export function moveCaretDown() {
    this.moveY(+1);
}

export function moveCaretPageUp() {
    this.moveY(-10);
}

export function moveCaretPageDown() {
    this.moveY(+10);
}

export function gotoWordLeft() {
}

export function gotoWordRight() {
}

export function gotoBeginningOfLine() {
    this.moveX(-Infinity, true);
}

export function gotoEndOfLine() {
    this.moveX(+Infinity, true);
}
