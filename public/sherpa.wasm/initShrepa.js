const loadSherpaModule = async () => {
  try {
    console.log('inited!');
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

function fileExists(filename) {
  const filenameLen = Module.lengthBytesUTF8(filename) + 1;
  const buffer = Module._malloc(filenameLen);
  Module.stringToUTF8(filename, buffer, filenameLen);

  let exists = Module._SherpaOnnxFileExists(buffer);

  Module._free(buffer);

  return exists;
}

loadSherpaModule();