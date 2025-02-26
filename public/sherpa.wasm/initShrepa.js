const loadSherpaModule = async () => {
  try {
    window.sherpaModule = Module;
    Module.onRuntimeInitialized = function() {
      console.log('inited!');
      window.OfflineRecognizer = OfflineRecognizer;
      window.createVad = createVad;
    };
  } catch (error) {
    console.error('Failed to load WASM module', error);
  }
};

loadSherpaModule();