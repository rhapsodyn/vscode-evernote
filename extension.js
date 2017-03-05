'use strict'

const vscode = require('vscode');
const adapter = require('./evernote-adapter.js');
const converter = require('./converter.js');

//TODO do sth with canceltoken
//TODO do sth with catch()

function openDocWithContent(content) {
    vscode.workspace.openTextDocument({language: "markdown"}).then(doc => {
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
    let notebooks, noteMetas;
    
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
        let selectedGuid = noteMetas.find(meta => meta.title === selected).guid;
        return adapter.getNoteContent(selectedGuid);
        
    }).then(openDocWithContent);
}

function activate(context) {
    console.log('Congratulations, your extension "vscode-evernote" is now active!');
    
    let navToOneNoteCmd = vscode.commands.registerCommand('extension.navToOneNote', navToOneNote);
    
    context.subscriptions.push(navToOneNoteCmd);
}

function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;