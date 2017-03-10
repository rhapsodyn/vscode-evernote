'use strict'

const Evernote = require('evernote');
const vscode = require('vscode');
let config = null;
// try {
//     config = require('./debug-token.js');
// } catch (err) {
    config = vscode.workspace.getConfiguration("evernote");
    console.log(JSON.stringify(config));
// }

const MAX_QUERY_COUNT = 99; //TODO only get 99 notes of a notebook

var client, noteStore;

function listNoteBooks() {
    client = new Evernote.Client({token: config.token});
    noteStore = client.getNoteStore(config.noteStoreUrl);
    return noteStore.listNotebooks();
}

function listAllNoteMetas(notebookGuid) {
    return noteStore.findNotesMetadata({notebookGuid}, 0, MAX_QUERY_COUNT, {includeTitle: true});
}

function getNoteContent(noteGuid) {
    return noteStore.getNoteContent(noteGuid);
}

function updateNoteContent(guid, title, content) {
    return noteStore.updateNote({guid, title, content});
}

module.exports = {
    listNoteBooks,
    listAllNoteMetas,
    getNoteContent,
    updateNoteContent
};