//pass ENML to md, and back
// const xml2js = require('xml2js');
const toMarkdown = require('to-markdown');
const marked = require('marked');

function toMd(enml) {
    let beginTagIndex = enml.indexOf('<en-note');
    let startIndex = enml.indexOf('>', beginTagIndex) + 1;
    let endIndex = enml.indexOf('</en-note>');

    let commentRegex = /<!--.*?-->/;
    let htmlStr = enml.substring(startIndex, endIndex).replace(commentRegex, '');
    return toMarkdown(htmlStr);
}

function toHtml(markdown) {
    return marked(markdown);
}

exports.toMd = toMd;
exports.toHtml = toHtml;