Object.assign(ape, (function(){
  var IndexedList = function(){
    this._list = [];
    this._index = {};
  };

  Object.assign(IndexedList.prototype, {
    push: function(key, item){
      if (this._list[key]) {
        throw Error("Key already in index" + key);
      }
      var location = this._list.push(item) - 1;
      this._index[key] = location;
    },
    has: function(key){
      return this._index[key] !== undefined;
    },
    get: function(key){
      var location = this._index[key];
      if(location !== undefined){
        return this._list[location];
      }
      return null;
    },
    remove: function(key){
      var location = this._index[key];
      if(location !== undefined) {
        this._list.splice(location, 1);
        delete this._index[key];

        for(key in this._index){
          var idx = this._index[key];
          if(idx > location){
            this._index[key] = idx - 1;
          }
        }
        return true;
      }
      return false;
    },
    list: function(){
      return this._list;
    },
    clear: function(){
      this._list.length = 0;

      for (var prop in this._index) {
        delete this._index[prop];
      }
    }
  });

  return {
    IndexedList: IndexedList
  };
}()));
