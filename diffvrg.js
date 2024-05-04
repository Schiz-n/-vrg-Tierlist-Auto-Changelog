const fs = require('fs');
const path = require('path');
const outputFile = 'vrgchanges.txt'

function getFilesInDirectory(dir) {
  return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isFile());
}

function compareArrays(arr1, arr2) {
  const added = arr1.filter(x => !arr2.includes(x));
  const removed = arr2.filter(x => !arr1.includes(x));
  return { added, removed };
}

function compareFileSizes(file1, file2) {
  const stats1 = fs.statSync(file1);
  const stats2 = fs.statSync(file2);
  return stats1.size !== stats2.size;
}

function appendToFile(filePath, content) {
  fs.appendFileSync(filePath, content + '\n');
}

function compareFolders(folder1, folder2) {
  const files1 = getFilesInDirectory(folder1);
  const files2 = getFilesInDirectory(folder2);

  const { added, removed } = compareArrays(files1, files2);
  added.length > 0 && appendToFile(outputFile, "New faces: " + added.join(', '));
  removed.length > 0 && appendToFile(outputFile, "Removed faces: " + removed.join(', '));

  const commonFiles = files1.filter(file => files2.includes(file));
  commonFiles.forEach(file => {
    const filePath1 = path.join(folder1, file);
    const filePath2 = path.join(folder2, file);
    if (compareFileSizes(filePath1, filePath2)) {
      appendToFile(outputFile, `${file} has changed his picture.`);
    }
  });
}

if (process.argv.length !== 4) {
  console.log('Usage: node diffvrg.js oldfolder newfolder');
  process.exit(1);
}
//too lazy to add another today's date handler will just use folder1 as date name
//I could make a common scripts file but it's already 3 files tf am I doing
const folder1 = process.argv[2];
const folder2 = process.argv[3];
appendToFile(outputFile, `--${folder2}--`);
compareFolders(folder1, folder2);
