// Modified version of:
// https://github.com/eosterberg/terminaljs/blob/master/terminal.js

var Console = (function () {
    var TerminalConstructor = function (parentElement) {
        this._parentElement = parentElement;
        this._innerWindow = document.createElement('div');
        this._output = document.createElement('p');

        this.print = function (message) {
            var newLine = document.createElement('div');
            newLine.textContent = message;
            this._output.appendChild(newLine);
        }

        this.clear = function () {
            while (this._output.firstChild) {
                this._output.removeChild(this._output.firstChild);
            }
        }

        this._innerWindow.appendChild(this._output);
        this._parentElement.appendChild(this._innerWindow);
    }

    return TerminalConstructor;
}())
