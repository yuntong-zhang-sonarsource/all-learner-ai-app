const loadSherpaModule = async () => {
  try {
    console.log('inited!');
    if (!Module || typeof Module !== 'object') {
      throw new Error('Module is not properly initialized');
    }
    window.sherpaModule = Module;
    Module.onRuntimeInitialized = function() {
      console.log('inited!');
      console.log('Sherpa WASM module initialized successfully');

      if (typeof OfflineRecognizer !== 'function' || typeof createVad !== 'function') {
        throw new Error('Required functions not found in WASM module');
      }
      window.OfflineRecognizer = OfflineRecognizer;
      window.createVad = createVad;
    };
  } catch (error) {
    console.error('Failed to load WASM module', error);
    console.error('Failed to load Sherpa WASM module:', error.message);
    throw error;
  }
};

loadSherpaModule();