'use strict'

const Evernote = require('evernote');
const temp = require('./debug-token.js');
const MAX_QUERY_COUNT = 99; //TODO only get 99 notes of a notebook

var client, noteStore;

function listNoteBooks() {
    client = new Evernote.Client({token: temp.token});
    noteStore = client.getNoteStore(temp.noteStoreUrl);
    return noteStore.listNotebooks();
}

function listAllNoteMetas(notebookGuid) {
    return noteStore.findNotesMetadata({notebookGuid}, 0, MAX_QUERY_COUNT, {includeTitle: true});
}

function getNoteContent(noteGuid) {
    return noteStore.getNoteContent(noteGuid);
}

module.exports = {
    listNoteBooks,
    listAllNoteMetas,
    getNoteContent
};