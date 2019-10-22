
application里面

this.loader, this.assets,
它们分别是resource文件里面loader.js和asset文件里面asserRegistry.js
的两个实例。

在resource文件里面，都是application具体怎么载入资源的代码。
它们都是由一个个handler类输出，并且在application中定义
