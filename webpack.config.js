const path = require('path');

module.exports = {
  experiments: {
    executeModule: true,
    outputModule: true,
    asyncWebAssembly: true,
    syncWebAssembly: true,
    layers: true,
    topLevelAwait: true,
    lazyCompilation: true
}
};