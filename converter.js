'use strict'
//pass ENML to md, and back

// const xml2js = require('xml2js');
const toMarkdown = require('to-markdown');
const marked = require('marked');
const MAGIC_SPELL = "%VSCODE_EVERNOTE%";

const customRenderer = new marked.Renderer();
customRenderer.heading = (text, level) => {
    return '<h'+ level + '>'
    + text
    + '</h' + level + '>\n';
};
customRenderer.listitem = function(text) {
    if (/^\s*\[[x ]\]\s*/.test(text)) {
        text = text
        .replace(/^\s*\[ \]\s*/, '<en-todo/>')
        .replace(/^\s*\[x\]\s*/, '<en-todo checked="true"/> ');
        // return '<li style="list-style: none">' + text + '</li>';
        return '<li>' + text + '</li>';
    } else {
        return '<li>' + text + '</li>';
    }
};

function toMd(enml) {
    if (!enml) {
        return "";
    }
    
    let beginTagIndex = enml.indexOf('<en-note'); //<en-node style="blahblah">
    let startIndex = enml.indexOf('>', beginTagIndex) + 1;
    let endIndex = enml.indexOf('</en-note>');
    let rawContent = enml.substring(startIndex, endIndex);
    
    if (rawContent.indexOf(MAGIC_SPELL) != -1) { //made in my extension
        
        //with out regex.replace, i can cast the spell
        let beginMark = '<!--' + MAGIC_SPELL;
        let beginMagicIdx = rawContent.indexOf(beginMark) + beginMark.length;
        let endMagicIdx = rawContent.indexOf(MAGIC_SPELL + '-->');
        let magicString = rawContent.substring(beginMagicIdx, endMagicIdx);
        
        console.log('magicString: ' + magicString);
        
        let base64content = new Buffer(magicString, 'base64');
        return base64content.toString('utf-8');
    } else { //made in elsewhere
        
        let commentRegex = /<!--.*?-->/;
        let htmlStr = rawContent.replace(commentRegex, '');
        return toMarkdown(htmlStr);
    }
}

function toHtml(markdown) {
    return marked(markdown, { xhtml: true, renderer: customRenderer });
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
exports.toEnml = toEnml;