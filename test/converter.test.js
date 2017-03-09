const assert = require('assert');
const converter = require('../converter.js');

suite("Converter Tests(coz it cant be debug)", () => {

    test('toMd', () => {
        let enml = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note style=";">'
                    + '<!--%VSCODE_EVERNOTE%Zm9vbyoqYmFyKio=%VSCODE_EVERNOTE%--><p>fooo<strong>bar</strong></p></en-note>';

        let md = converter.toMd(enml);

        // console.log(md);
        assert(md == 'fooo**bar**');
    });
});