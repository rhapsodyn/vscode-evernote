const vscode = require('vscode');

class EvernoteContentProvider {
    constructor() {
        console.log('ctopr');
    }

    onDidChange() {

    }

    provideTextDocumentContent(uri, token) {
        console.log(uri);
    }
}

module.exports = EvernoteContentProvider;

