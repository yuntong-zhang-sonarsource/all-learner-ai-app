const loadSherpaModule = async () => {
    try {
      if (typeof Module === 'undefined') {
        throw new Error('Module is not defined');
      }
      window.sherpaModule = Module;
      Module.onRuntimeInitialized = function() {
        console.log('inited!');

        recognizer = createOnlineRecognizer(Module);
        window.sherpaRecognizer =recognizer;
        console.log('recognizer is created!', recognizer);
      };
    } catch (error) {
      console.error('Failed to load WASM module', error);
    }
  };
  
  loadSherpaModule();