
var vscode = require('vscode');

function activate(context) {
    var timeout = null;
    var activeEditor = vscode.window.activeTextEditor;
    var decorationTypes = {};

    vscode.window.onDidChangeTextEditorSelection(function (event) {
        //var aaa = activeEditor.document.getText(activeEditor.selection);
        //console.log("1onDidChangeTextEditorSelection:" + aaa);
        triggerUpdateDecorations();
    
    }, null, context.subscriptions);

    vscode.window.onDidChangeActiveTextEditor(function (editor) {
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);


    //vscode.window.showInformationMessage(test);

    function triggerUpdateDecorations() {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(updateDecorations, 50);
    }

    function updateDecorations() {
        if (!activeEditor || !activeEditor.document) {
            return;
        }

        var text = activeEditor.document.getText();
        var word = activeEditor.document.getText(activeEditor.selection);
        //console.log("1word:"+word);
        var mathes = {}, match;
        var opts = 'gi';
        var pattern = new RegExp(word, opts);
        if (word != "") {
            while (match = pattern.exec(text)) {
                var startPos = activeEditor.document.positionAt(match.index);
                var endPos = activeEditor.document.positionAt(match.index + match[0].length);
                var range= {
                    range: new vscode.Range(startPos, endPos)
                };
                var matchedValue = match[0];
                if (mathes[matchedValue]) {
                    mathes[matchedValue].push(range);
                } else {
                    mathes[matchedValue] = [range];
                }

                if (!decorationTypes[matchedValue]) {
                    decorationTypes[matchedValue] = vscode.window.createTextEditorDecorationType({
                        borderWidth: '2px',
                        borderStyle: 'solid',
                    });
                }
            } 
        }
        
        Object.keys(decorationTypes).forEach((v) => {
            var range = mathes[v] ? mathes[v] : [];
            var decorationType = decorationTypes[v];
            activeEditor.setDecorations(decorationType, range);
        })
    }
}
exports.activate = activate;


function deactivate() {
}
exports.deactivate = deactivate;