const { readdir } = require('fs/promises');
const path = require('path');
const { stat } = require('fs');

const dirPath = path.resolve(__dirname, 'secret-folder');

(async function getDir() {
  try {
    const files = await readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        stat(path.resolve(dirPath, file.name), (err, stats) => {
          console.log(
            `${String(file.name).replace('.', ' - ')} - ${stats.size} byte`
          );
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
