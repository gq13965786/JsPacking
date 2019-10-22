Object.assign(ape, (function() {

  //ape.hashCode()
  //calculates simple hash value from a string
  return{
    hashCode: function (str) {
        var hash = 0;
        for (var i = 0, len = str.length; i < len; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            // Convert to 32bit integer
            hash |= 0;
        }
        return hash;
    }
  };
}()));
