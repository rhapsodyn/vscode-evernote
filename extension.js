'use strict'

const vscode = require('vscode');
const adapter = require('./evernote-adapter.js');
const converter = require('./converter.js');
const EvernoteContentProvider = require('./evernote-content-provider');

//TODO do sth with canceltoken
//TODO do sth with catch()

function openDocWithContent(selectedMeta, content) {
    console.log('note content:' + content);

    var uri = vscode.Uri.parse('evernote://authority/fooo');
    vscode.workspace.openTextDocument(uri).then(doc => {
        return vscode.window.showTextDocument(doc);
    }).then(editor => {
        let startPos = new vscode.Position(1,0);
        editor.edit(edit => {
            let mdContent = converter.toMd(content);
            edit.insert(startPos, mdContent);
        });
    });
}

function navToOneNote() {
    console.log('nav to one');

    let notebooks, noteMetas, selectedMeta;
    
    adapter.listNoteBooks().then(allNotebooks => {
        notebooks = allNotebooks;
        let allNoteBookNames = allNotebooks.map(notebook => notebook.name);
        
        return vscode.window.showQuickPick(allNoteBookNames);
        
    }).then(selected => {
        let selectedGuid = notebooks.find(notebook => notebook.name === selected).guid;
        return adapter.listAllNoteMetas(selectedGuid);
        
    }).then(metaList => {
        noteMetas = metaList.notes;
        let allNoteTitles = noteMetas.map(noteMeta => noteMeta.title);
        
        return vscode.window.showQuickPick(allNoteTitles);
        
    }).then(selected => {
        selectedMeta = noteMetas.find(meta => meta.title === selected);
        return adapter.getNoteContent(selectedMeta.guid);
        
    }).then(openDocWithContent.bind(null, selectedMeta));
}

function updateNote() {
    // vscode.window.activeTextEditor.document.getText()    
}

function activate(context) {
    let navToOneNoteCmd = vscode.commands.registerCommand('extension.navToOneNote', navToOneNote);
    let updateNoteCmd = vscode.commands.registerCommand('extension.updateNote', updateNote);

    let customProvider = vscode.workspace.registerTextDocumentContentProvider('evernote', new EvernoteContentProvider());
    
    context.subscriptions.push(navToOneNoteCmd);
    context.subscriptions.push(updateNoteCmd);
    context.subscriptions.push(customProvider);
}

function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;