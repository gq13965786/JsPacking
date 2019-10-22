/**
 * @namespace Contains directories for accessing content
 * @name ape.content
 */
ape.content = function () {
    return {
        /**
         * The url of the game code relative to the page.
         * @name ape.content.source
         */
        source: "",
        /**
         * The url of the assets relative to the page
         * @name ape.content.assets
         */
        assets: null,

        /**
         * Entity Data exported from the game database is store in the data attribute
         */
        data: {},

        /**
         * If data is access via a repository then the username of the owner is required
         */
        username: null,

        /**
         * If data is access via a repository then the project name is required
         */
        project: null

        /*
        gameRoot: "http://localhost/gamedb/",
        gameBranch: "gamedb/",
        //gameURI: ape.path.join(ape.content.gameRoot, ape.content.gameBranch);
        gameURI: "http://localhost/webgamedk/tools/src/kedit/kedit/models/fixtures/",

        assetRoot: "http://localhost/webgamedk/tests/data/",
        assetBranch: "",
        assetURI: ape.path.join(content.assetRoot, content.assetBranch)
        */
    };
} ();
