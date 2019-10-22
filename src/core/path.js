ape.path = function () {
    return {
        delimiter: "/",
        join: function () {
            var index;
            var num = arguments.length;
            var result = arguments[0];

            for (index = 0; index < num - 1; ++index) {
                var one = arguments[index];
                var two = arguments[index + 1];
                if (!ape.isDefined(one) || !ape.isDefined(two)) {
                    throw new Error("undefined argument to ape.path.join");
                }
                if (two[0] === ape.path.delimiter) {
                    result = two;
                    continue;
                }

                if (one && two && one[one.length - 1] !== ape.path.delimiter && two[0] !== ape.path.delimiter) {
                    result += (ape.path.delimiter + two);
                } else {
                    result += (two);
                }
            }

            return result;
        },
        normalize: function (path) {
            var lead = path.startsWith(ape.path.delimiter);
            var trail = path.endsWith(ape.path.delimiter);

            var parts = path.split('/');

            var result = '';

            var cleaned = [];

            for (var i = 0; i < parts.length; i++) {
                if (parts[i] === '') continue;
                if (parts[i] === '.') continue;
                if (parts[i] === '..' && cleaned.length > 0) {
                    cleaned = cleaned.slice(0, cleaned.length - 2);
                    continue;
                }

                if (i > 0) cleaned.push(ape.path.delimiter);
                cleaned.push(parts[i]);
            }


            result = cleaned.join('');
            if (!lead && result[0] === ape.path.delimiter) {
                result = result.slice(1);
            }

            if (trail && result[result.length - 1] !== ape.path.delimiter) {
                result += ape.path.delimiter;
            }

            return result;
        },
        split: function (path) {
            var parts = path.split(ape.path.delimiter);
            var tail = parts.slice(parts.length - 1)[0];
            var head = parts.slice(0, parts.length - 1).join(ape.path.delimiter);
            return [head, tail];
        },
        getBasename: function (path) {
            return ape.path.split(path)[1];
        },
        getDirectory: function (path) {
            var parts = path.split(ape.path.delimiter);
            return parts.slice(0, parts.length - 1).join(ape.path.delimiter);
        },
        getExtension: function (path) {
            var ext = path.split('?')[0].split('.').pop();
            if (ext !== path) {
                return "." + ext;
            }
            return "";
        },
        isRelativePath: function (s) {
            return s.charAt(0) !== "/" && s.match(/:\/\//) === null;
        },
        extractPath: function (s) {
            var path = ".",
                parts = s.split("/"),
                i = 0;

            if (parts.length > 1) {
                if (ape.path.isRelativePath(s) === false) {
                    path = "";
                }
                for (i = 0; i < parts.length - 1; ++i) {
                    path += "/" + parts[i];
                }
            }
            return path;
        }
    };
}();
