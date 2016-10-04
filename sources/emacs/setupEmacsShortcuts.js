export function setupEmacsShortcuts(editor) {

    return editor.setupEditorShortcuts({

        [`backspace`]: [ `erasePreviousCharacter` ],
        [`delete`]:    [ `eraseNextCharacter` ],

        [`left`]:      [ `moveCaretLeft` ],
        [`right`]:     [ `moveCaretRight` ],
        [`up`]:        [ `moveCaretUp` ],
        [`down`]:      [ `moveCaretDown` ],

        [`pageup`]:    [ `moveCaretPageUp` ],
        [`pagedown`]:  [ `moveCaretPageDown` ],

        [`C-left`]:    [ `gotoWordLeft` ],
        [`C-right`]:   [ `gotoWordRight` ],

        [`C-a`]:       [ `gotoBeginningOfLine` ],
        [`C-e`]:       [ `gotoEndOfLine` ]

    });

}
