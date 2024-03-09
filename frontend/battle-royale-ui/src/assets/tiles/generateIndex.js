const fs = require("fs");
const path = require("path");

const generateIndex = (theme) => {
  const imagesDir = path.join(__dirname, theme);
  const indexFile = path.join(imagesDir, "index.js");

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    const importsAndExports = files
      .filter((file) => /\.(png|jpe?g|svg)$/.test(file))
      .map((file, index) => {
        const variableName = `image${index}`;
        const fileName = path.basename(file, path.extname(file)); // Extract filename without extension
        return `import ${variableName} from './${file}';\nexport const ${fileName} = ${variableName};`;
      });

    const content = importsAndExports.join("\n\n");

    fs.writeFile(indexFile, content.trim(), (err) => {
      if (err) throw err;
      console.log(`Index file ${indexFile} was created successfully.`);
    });
  });
};

generateIndex("clean");
generateIndex("pixel");
