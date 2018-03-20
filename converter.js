"use strict";
//pass ENML to md, and back

// const xml2js = require('xml2js');
const util = require("util");
const toMarkdown = require("to-markdown");
const marked = require("marked");
const MAGIC_SPELL = "%VSCODE_EVERNOTE%";

const customRenderer = new marked.Renderer();
customRenderer.heading = (text, level) => {
  return "<h" + level + ">" + text + "</h" + level + ">\n";
};
//handle the todos
customRenderer.listitem = function(text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    text = text
      .replace(/^\s*\[ \]\s*/, "<en-todo/>")
      .replace(/^\s*\[x\]\s*/, '<en-todo checked="true"/> ');
    // return '<li style="list-style: none">' + text + '</li>';
    return "<li>" + text + "</li>";
  } else {
    return "<li>" + text + "</li>";
  }
};

function toMd(enml) {
  if (!enml) {
    return "";
  }

  let beginTagIndex = enml.indexOf("<en-note"); //<en-node style="blahblah">
  let startIndex = enml.indexOf(">", beginTagIndex) + 1;
  let endIndex = enml.indexOf("</en-note>");
  let rawContent = enml.substring(startIndex, endIndex);

  if (rawContent.indexOf(MAGIC_SPELL) != -1) {
    //made in my extension

    //with out regex.replace, i can cast the spell
    let beginMark = "<!--" + MAGIC_SPELL;
    let beginMagicIdx = rawContent.indexOf(beginMark) + beginMark.length;
    let endMagicIdx = rawContent.indexOf(MAGIC_SPELL + "-->");
    let magicString = rawContent.substring(beginMagicIdx, endMagicIdx);

    let base64content = new Buffer(magicString, "base64");
    return base64content.toString("utf-8");
  } else {
    //made || touched in elsewhere

    let commentRegex = /<!--.*?-->/;
    let htmlStr = rawContent.replace(commentRegex, "");
    let md = toMarkdown(htmlStr);

    return processTodo(md);
  }
}

function processTodo(md) {
  return md
    .replace(/<en-todo\s+checked="true"\s*\/?>/g, "[x] ")
    .replace(/<en-todo\s+checked="false"\s*\/?>/g, "[ ] ")
    .replace(/<en-todo\s*\/?>/g, "[ ] ")
    .replace(/<\/en-todo>/g, "");
}

function toHtml(markdown) {
  return marked(markdown, { xhtml: true, renderer: customRenderer });
}

function toEnml(content) {
  let enml =
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note style=";">';

  enml += "<!--" + MAGIC_SPELL;
  enml += new Buffer(content, "utf-8").toString("base64");
  enml += MAGIC_SPELL + "-->";

  enml += toHtml(content);

  enml += "</en-note>";

  return enml;
}

const tmpl = "<!--\ntitle:%s\ntags:%s\nnotebook:%s\n-->\n\n";

function metaToComment(noteMeta, notebookName) {
  return util.format(tmpl, noteMeta.title, "foo", notebookName);
}

// eslint-disable-next-line
function commentToMeta(commentStr) {
  // TODO
}

exports.toMd = toMd;
exports.toEnml = toEnml;
exports.metaToComment = metaToComment;
exports.commentToMeta = commentToMeta;
