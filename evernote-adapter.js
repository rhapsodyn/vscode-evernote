'use strict'

const Evernote = require('evernote');
const vscode = require('vscode');
const config = vscode.workspace.getConfiguration("evernote");

const MAX_QUERY_COUNT = 20; //TODO only get 20 of a notebook

let client, noteStore;

//TODO should be hide by callback, BUT
function showStatusBarMsg(msg) {
    vscode.window.setStatusBarMessage(msg, 2000);
}

function listNoteBooks() {
    showStatusBarMsg("Requesting notebooks......");
    
    client = new Evernote.Client({token: config.token});
    noteStore = client.getNoteStore(config.noteStoreUrl);
    return noteStore.listNotebooks();
}

function listAllNoteMetas(notebookGuid) {
    showStatusBarMsg("Requesting all note metas......");
    
    return noteStore.findNotesMetadata({notebookGuid}, 0, MAX_QUERY_COUNT, {includeTitle: true, includeTagGuids: true});
}

function getNoteContent(noteGuid) {
    showStatusBarMsg("Requesting note content......");
    
    return noteStore.getNoteContent(noteGuid);
}

function updateNoteContent(guid, title, content) {
    showStatusBarMsg("Updating note content......");
    
    return noteStore.updateNote({guid, title, content});
}

function createNotebook(title) {
    showStatusBarMsg("Creating notebook: " + title + "......");

    return noteStore.createNotebook({name: title});
}

function createNote(title, notebookGuid) {
    showStatusBarMsg("Creating note: " + title + "......");

    return noteStore.createNote({title, notebookGuid});
}

module.exports = {
    listNoteBooks,
    listAllNoteMetas,
    getNoteContent,
    updateNoteContent,
    createNotebook,
    createNote
};