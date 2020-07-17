function Any(array) {
    return array.some((element) => element != null);
}

module.exports = {
    Any: Any
  };