define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var stringEscape = /\\(?:[nrt0'"\\]|x[\da-fA-F]{2}|u\{[\da-fA-F]{6}\})/.source;
var MoveHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = { start:
       [ { token: 'variable.other.source.move',
           // `(?![\\\'])` to keep a lifetime name highlighting from continuing one character
           // past the name. The end `\'` will block this from matching for a character like
           // `'a'` (it should have character highlighting, not variable highlighting).
           regex: '\'[a-zA-Z_][a-zA-Z0-9_]*(?![\\\'])' },
         { token: 'string.quoted.single.source.move',
           regex: "'(?:[^'\\\\]|" + stringEscape + ")'" },
         { token: 'identifier',
           regex:  /r#[a-zA-Z_][a-zA-Z0-9_]*\b/ },
         {
            stateName: "bracketedComment",
            onMatch : function(value, currentState, stack){
                stack.unshift(this.next, value.length - 1, currentState);
                return "string.quoted.raw.source.move";
            },
            regex : /r#*"/,
            next  : [
                {
                    onMatch : function(value, currentState, stack) {
                        var token = "string.quoted.raw.source.move";
                        if (value.length >= stack[1]) {
                            if (value.length > stack[1])
                                token = "invalid";
                            stack.shift();
                            stack.shift();
                            this.next = stack.shift();
                        } else {
                            this.next = "";
                        }
                        return token;
                    },
                    regex : /"#*/,
                    next  : "start"
                }, {
                    defaultToken : "string.quoted.raw.source.move"
                }
            ]
         },
         { token: 'string.quoted.double.source.move',
           regex: '"',
           push:
            [ { token: 'string.quoted.double.source.move',
                regex: '"',
                next: 'pop' },
              { token: 'constant.character.escape.source.move',
                regex: stringEscape },
              { defaultToken: 'string.quoted.double.source.move' } ] },
         { token: [ 'keyword.source.move', 'text', 'entity.name.function.source.move' ],
           regex: '\\b(fn)(\\s+)((?:r#)?[a-zA-Z_][a-zA-Z0-9_]*)' },
         { token: 'support.constant', regex: '\\b[a-zA-Z_][\\w\\d]*::' },
         { token: 'keyword.source.move',
           regex: '\\b(?:mut|create|resource|abstract|continue|for|new|switch|goto|do|if|private|this|break|protected|throw|else|public|enum|return|catch|try|interface|static|class|finally|const|super|while|true|false|assert|release|new|return|let|import|main|script|public|private|struct|module|if|else|for|else|for|while|do|break|continue|throw|returns|return|suicide|new|is|this|super|modules|native|copy|exists|move|withdraw_from_sender|deposit|main")\\b' },
         { token: 'storage.type.source.move',
           regex: '\\b(?:boolean|double|byte|int|short|char|void|long|float|address|string|bool|u64|bytearray|0x42)\\b' },
         { token: 'variable.language.source.move', regex: '\\bSelf\\b' },

         { token: 'comment.line.doc.source.move',
           regex: '//!.*$' },
         { token: 'comment.line.double-dash.source.move',
           regex: '//.*$' },
         { token: 'comment.start.block.source.move',
           regex: '/\\*',
           stateName: 'comment',
           push:
            [ { token: 'comment.start.block.source.move',
                regex: '/\\*',
                push: 'comment' },
              { token: 'comment.end.block.source.move',
                regex: '\\*/',
                next: 'pop' },
              { defaultToken: 'comment.block.source.move' } ] },

         { token: 'keyword.operator',
         // `[*/](?![*/])=?` is separated because `//` and `/* */` become comments and must be
         // guarded against. This states either `*` or `/` may be matched as long as the match
         // it isn't followed by either of the two. An `=` may be on the end.
           regex: /\$|[-=]>|[-+%^=!&|<>]=?|[*/](?![*/])=?/ },
         { token : "punctuation.operator", regex : /[?:,;.#]/ },
         { token : "paren.lparen", regex : /[\[({]/ },
         { token : "paren.rparen", regex : /[\])}]/ },
         { token: 'constant.language.source.move',
           regex: '\\b(?:true|false|Some|None|Ok|Err)\\b' },
         { token: 'support.constant.source.move',
           regex: '\\b(?:EXIT_FAILURE|EXIT_SUCCESS|RAND_MAX|EOF|SEEK_SET|SEEK_CUR|SEEK_END|_IOFBF|_IONBF|_IOLBF|BUFSIZ|FOPEN_MAX|FILENAME_MAX|L_tmpnam|TMP_MAX|O_RDONLY|O_WRONLY|O_RDWR|O_APPEND|O_CREAT|O_EXCL|O_TRUNC|S_IFIFO|S_IFCHR|S_IFBLK|S_IFDIR|S_IFREG|S_IFMT|S_IEXEC|S_IWRITE|S_IREAD|S_IRWXU|S_IXUSR|S_IWUSR|S_IRUSR|F_OK|R_OK|W_OK|X_OK|STDIN_FILENO|STDOUT_FILENO|STDERR_FILENO)\\b' },
         { token: 'meta.preprocessor.source.move',
           regex: '\\b\\w\\(\\w\\)*!|#\\[[\\w=\\(\\)_]+\\]\\b' },
         { token: 'constant.numeric.source.move',
           regex: /\b(?:0x[a-fA-F0-9_]+|0o[0-7_]+|0b[01_]+|[0-9][0-9_]*(?!\.))(?:[iu](?:size|8|16|32|64|128))?\b/ },
         { token: 'constant.numeric.source.move',
           regex: /\b(?:[0-9][0-9_]*)(?:\.[0-9][0-9_]*)?(?:[Ee][+-][0-9][0-9_]*)?(?:f32|f64)?\b/ } ] };

    this.normalizeRules();
};

MoveHighlightRules.metaData = { fileTypes: [ 'mvir' ],
      foldingStartMarker: '^.*\\bfn\\s*(\\w+\\s*)?\\([^\\)]*\\)(\\s*\\{[^\\}]*)?\\s*$',
      foldingStopMarker: '^\\s*\\}',
      name: 'Move',
      scopeName: 'source.move' };


oop.inherits(MoveHighlightRules, TextHighlightRules);

exports.MoveHighlightRules = MoveHighlightRules;
});
