const { readdir, readFile, writeFile, mkdir, copyFile, rm } = require('fs/promises');
const path = require('path');

const dstDirPath = path.resolve(__dirname, 'project-dist');
const srcAssetsPath = path.resolve(__dirname, 'assets');
const dstStylePath = path.resolve(__dirname, 'project-dist', 'style.css');
const dstHtmlPath = path.resolve(__dirname, 'project-dist', 'index.html');
const srcStylePath = path.resolve(__dirname, 'styles');
const htmlTemplatePath = path.resolve(__dirname, 'template.html');
const htmlComponentsPath = path.resolve(__dirname, 'components');
const bundleArr = [];
const components = {};
let htmlTemplate = '';

delDir(dstDirPath)
  .then(mkdir(dstDirPath, { recursive: true }))
  .then(copyDir(srcAssetsPath, path.resolve(dstDirPath, 'assets')))
  .then(mergeStyles(srcStylePath, dstStylePath))
  .then(buildHtml());

async function delDir(dirPath) {
  try {
    const isEmpty = await readdir(dirPath);
    if (!isEmpty) {
      const files = await readdir(dirPath, { withFileTypes: true });
      for (const file of files) {
        if (!file.isFile()) {
          delDir(path.resolve(dirPath, file.name));
        }
      }
      await rm(dirPath);
    }
  } catch (err) {
    if (!(err.syscall === 'scandir'))
      console.error(err);
  }
}

async function copyDir(src, dst) {
  try {
    const dstDir = await mkdir(dst, { recursive: true });
    if (!dstDir) {
      await rm(dst, { recursive: true });
      await mkdir(dst, { recursive: true });
    }
    const files = await readdir(src, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(path.resolve(src, file.name), path.resolve(dst, file.name));
      } else {
        copyDir(path.resolve(src, file.name), path.resolve(dst, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function mergeStyles(src, dst) {
  try {
    const files = await readdir(src, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.resolve(src, file.name);
      if (file.isFile() && path.extname(filePath) === '.css') {
        const fileData = await readFile(filePath);
        bundleArr.push(fileData);
      }
    }
    await writeFile(dst, bundleArr);
  } catch (err) {
    console.error(err);
  }
}

function getTemplate() {
  return readFile(htmlTemplatePath);
}

async function getComponents() {
  let componentName, componentData;
  try {
    const files = await readdir(htmlComponentsPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        componentData = await readFile(path.resolve(htmlComponentsPath, file.name));
        componentName = file.name.replace(/.html/g, '');
        components[componentName] = componentData.toString();
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function build(template) {
  return new Promise((res) => {
    for (let component in components) {
      template = template.replace(
        new RegExp(`{{${component}}}`, 'g'),
        components[component]
      );
    }
    if (template.match(new RegExp('{{(.*?)}}', 'g')))
      console.log('not all componets build coz of componet absent');
    writeFile(dstHtmlPath, template).then(res('build successfully!'));
  });
}

function buildHtml() {
  Promise.all([getTemplate(), getComponents()])
    .then((res) => {
      htmlTemplate = res[0].toString();
      return build(htmlTemplate);
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err.message));
}
