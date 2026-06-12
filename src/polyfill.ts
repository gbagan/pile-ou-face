if (!Map.prototype.getOrInsert) {
  Object.defineProperty(Map.prototype, 'getOrInsert', {
    value: function (key: any, defaultValue: any) {
      if (!this.has(key)) {
        this.set(key, defaultValue);
      }
      return this.get(key);
    },
    writable: true,
    configurable: true,
  });
}