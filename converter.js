'use strict'
//pass ENML to md, and back

// const xml2js = require('xml2js');
const toMarkdown = require('to-markdown');
const marked = require('marked');
const MAGIC_SPELL = "%VSCODE_EVERNOTE%";

function toMd(enml) {
    let beginTagIndex = enml.indexOf('<en-note'); //<en-node style="blahblah">
    let startIndex = enml.indexOf('>', beginTagIndex) + 1;
    let endIndex = enml.indexOf('</en-note>');
    let rawContent = enml.substring(startIndex, endIndex);
    
    if (rawContent.indexOf(MAGIC_SPELL) != -1) { //made in my extension

        //with out regex.replace, i can cast the spell
        let beginMagicIdx = rawContent.indexOf('<!--' + MAGIC_SPELL) + 1;
        let endMagicIdx = rawContent.indexOf(MAGIC_SPELL + '-->');

        var base64content = new Buffer(rawContent.substring(beginMagicIdx, endMagicIdx), 'base64');
        return base64content.toString('utf-8');
    } else { //made in elsewhere

        let commentRegex = /<!--.*?-->/;
        let htmlStr = rawContent.replace(commentRegex, '');
        return toMarkdown(htmlStr);
    }
}

function toHtml(markdown) {
    return marked(markdown);
}

function toEnml(content) {
    let enml = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note style=";">';

    enml += '<!--' + MAGIC_SPELL;
    enml += new Buffer(content, 'utf-8').toString('base64');
    enml += MAGIC_SPELL + '-->';

    enml += toHtml(content);

    enml += '</en-note>';

    return enml;
}

exports.toMd = toMd;
exports.toHtml = toHtml;
exports.toEnml = toEnml;