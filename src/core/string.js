ape.string = function () {
    var ASCII_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    var ASCII_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var ASCII_LETTERS = ASCII_LOWERCASE + ASCII_UPPERCASE;

    var HIGH_SURROGATE_BEGIN = 0xD800;
    var HIGH_SURROGATE_END = 0xDBFF;
    var LOW_SURROGATE_BEGIN = 0xDC00;
    var LOW_SURROGATE_END = 0xDFFF;
    var ZERO_WIDTH_JOINER = 0x200D;

    // Flag emoji
    var REGIONAL_INDICATOR_BEGIN = 0x1F1E6;
    var REGIONAL_INDICATOR_END = 0x1F1FF;

    // Skin color modifications to emoji
    var FITZPATRICK_MODIFIER_BEGIN = 0x1F3FB;
    var FITZPATRICK_MODIFIER_END = 0x1F3FF;

    // Accent characters
    var DIACRITICAL_MARKS_BEGIN = 0x20D0;
    var DIACRITICAL_MARKS_END = 0x20FF;

    // Special emoji joins
    var VARIATION_MODIFIER_BEGIN = 0xFE00;
    var VARIATION_MODIFIER_END = 0xFE0F;

    function getCodePointData(string, i) {
        var size = string.length;
        i = i || 0;
        // Account for out-of-bounds indices:
        if (i < 0 || i >= size) {
            return null;
        }
        var first = string.charCodeAt(i);
        var second;
        if (size > 1 && first >= HIGH_SURROGATE_BEGIN && first <= HIGH_SURROGATE_END) {
            second = string.charCodeAt(i + 1);
            if (second >= LOW_SURROGATE_BEGIN && second <= LOW_SURROGATE_END) {
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                return { code: (first - HIGH_SURROGATE_BEGIN) * 0x400 + second - LOW_SURROGATE_BEGIN + 0x10000, long: true };
            }
        }
        return { code: first, long: false };
    }

    function isCodeBetween(string, begin, end) {
        if (!string)
            return false;
        var codeData = getCodePointData(string);
        if (codeData) {
            var code = codeData.code;
            return code >= begin && code <= end;
        }
        return false;
    }

    function numCharsToTakeForNextSymbol(string, index) {
        if (index === string.length - 1) {
            // Last character in the string, so we can only take 1
            return 1;
        }
        if (isCodeBetween(string[index], HIGH_SURROGATE_BEGIN, HIGH_SURROGATE_END)) {
            var first = string.substring(index, index + 2);
            var second = string.substring(index + 2, index + 4);
            if (
                isCodeBetween(second, FITZPATRICK_MODIFIER_BEGIN, FITZPATRICK_MODIFIER_END) ||
                (isCodeBetween(first, REGIONAL_INDICATOR_BEGIN, REGIONAL_INDICATOR_END) &&
                isCodeBetween(second, REGIONAL_INDICATOR_BEGIN, REGIONAL_INDICATOR_END))
            ) {
                return 4;
            }
            return 2;
        }
        return 1;
    }

    return {
        ASCII_LOWERCASE: ASCII_LOWERCASE,
        ASCII_UPPERCASE: ASCII_UPPERCASE,
        ASCII_LETTERS: ASCII_LETTERS,

        format: function (s) {
            var i = 0,
                regexp,
                args = ape.makeArray(arguments);

            // drop first argument
            args.shift();

            for (i = 0; i < args.length; i++) {
                regexp = new RegExp('\\{' + i + '\\}', 'gi');
                s = s.replace(regexp, args[i]);
            }
            return s;
        },
        startsWith: function (s, subs) {
            console.warn("WARNING: startsWith: Function is deprecated. Use String.startsWith instead.");
            return s.startsWith(subs);
        },
        endsWith: function (s, subs) {
            console.warn("WARNING: endsWith: Function is deprecated. Use String.endsWith instead.");
            return s.endsWith(subs);
        },
        toBool: function (s, strict) {
            if (s === 'true') {
                return true;
            }

            if (strict) {
                if (s === 'false') {
                    return false;
                }

                throw new TypeError('Not a boolean string');
            }

            return false;
        },
        getCodePoint: function (string, i) {
            var codePointData = getCodePointData(string, i);
            return codePointData && codePointData.code;
        },
        getCodePoints: function (string) {
            if (typeof string !== 'string') {
                throw new TypeError('Not a string');
            }
            var i = 0;
            var arr = [];
            var codePoint;
            while (!!(codePoint = getCodePointData(string, i))) {
                arr.push(codePoint.code);
                i += codePoint.long ? 2 : 1;
            }
            return arr;
        },
        getSymbols: function (string) {
            if (typeof string !== 'string') {
                throw new TypeError('Not a string');
            }
            var index = 0;
            var length = string.length;
            var output = [];
            var take = 0;
            var ch;
            while (index < length) {
                take += numCharsToTakeForNextSymbol(string, index + take);
                ch = string[index + take];
                // Handle special cases
                if (isCodeBetween(ch, DIACRITICAL_MARKS_BEGIN, DIACRITICAL_MARKS_END)) {
                    ch = string[index + (take++)];
                }
                if (isCodeBetween(ch, VARIATION_MODIFIER_BEGIN, VARIATION_MODIFIER_END)) {
                    ch = string[index + (take++)];
                }
                if (ch && ch.charCodeAt(0) === ZERO_WIDTH_JOINER) {
                    ch = string[index + (take++)];
                    // Not a complete char yet
                    continue;
                }
                var char = string.substring(index, index + take);
                output.push(char);
                index += take;
                take = 0;
            }
            return output;
        },
        fromCodePoint: function (/* ...args */) {
            var chars = [];
            var current;
            var codePoint;
            var units;
            for (var i = 0; i < arguments.length; ++i) {
                current = Number(arguments[i]);
                codePoint = current - 0x10000;
                units = current > 0xFFFF ? [(codePoint >> 10) + 0xD800, (codePoint % 0x400) + 0xDC00] : [current];
                chars.push(String.fromCharCode.apply(null, units));
            }
            return chars.join('');
        }
    };
}();
