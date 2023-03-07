import { DecorationRangeBehavior, TextEditorDecorationType } from "vscode";

import * as vscode from "vscode";

function activate(context: vscode.ExtensionContext) {
  const colorizeDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: "yellow",
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
  });

  vscode.commands.registerCommand("extension.colorize", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const regex = /(\"[^\"]*\")/;
      const text = document.getText();
      const decorations: vscode.DecorationOptions[] = [];
      let match: any;
      while ((match = regex.exec(text))) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        editor.edit((editBuilder) => {
          editBuilder.replace(new vscode.Range(startPos, endPos), match[0]);
        });
        const decoration = {
          range: new vscode.Range(startPos, endPos),
          backgroundColor: "yellow",
        };
        decorations.push(decoration);
      }
      editor.setDecorations(colorizeDecorationType, decorations);
    }
  });

  vscode.commands.registerCommand("extension.toggleColorize", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      editor.setDecorations(colorizeDecorationType, []);
    }
  });

  const colorizeButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  colorizeButton.text = "Colorize";
  colorizeButton.command = "extension.colorize";
  colorizeButton.show();

  const toggleButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    99
  );
  toggleButton.text = "Toggle Colorize";
  toggleButton.command = "extension.toggleColorize";
  toggleButton.show();
}
