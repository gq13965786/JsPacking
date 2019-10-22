ape.post = {};

ape.post.initialize = function () {
    for (var effect in ape.post) {
        if (typeof ape.post[effect] === 'object') {
            ape.post[effect].initialize();
        }
    }
}
