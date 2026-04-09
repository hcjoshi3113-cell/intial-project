const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

const cssFiles = walkSync('src').filter(file => file.endsWith('.css'));

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('background: #fff;') || content.includes('background-color: #fff;')) {
    content = content.replace(/background(-color)?:\s*#fff(?:fff)?;/ig, 'background$1: var(--card-bg);');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
console.log("Done.");
