const fetch = require('node-fetch');
const path = require('path');
const sleep = require('sleep');
const {
  readdirSync,
  statSync,
  readFile,
  appendFileSync,
  unlinkSync,
  existsSync,
} = require('fs');

const dirDocs = './docs';
const dir = path.join(__dirname, dirDocs);

function travel(dir, callback) {
  readdirSync(dir).forEach(file => {
    const pathname = path.join(dir, file);
    if (statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}
travel(dir, function(pathname) {
  if (path.extname(pathname) === '.md') {
    /* 随机 sleep 防止被 google 反爬虫 */
    sleep.sleep(parseInt(Math.random() * 3 + 2));

    readFile(path.join(__dirname, './test.md'), { encoding: 'utf-8' }, function(
      err,
      fr,
    ) {
      if (!err) {
        const enFilePath = path.join(__dirname, './test.text');
        if (existsSync(enFilePath)) {
          unlinkSync(enFilePath);
        }

        const url = `https://translate.googleapis.com/translate_a/single?oe=UTF-8&i=UTF-8&client=gtx&dt=t&hl=zh-CN&sl=zh-CN&tl=en&text=${encodeURIComponent(
          fr,
        )}`;

        fetch(url)
          .then(res => res.json())
          .then(function(data) {
            data &&
              data[0] &&
              data[0] &&
              data[0].forEach(item => {
                if (item && item[0]) {
                  appendFileSync(enFilePath, item[0]);
                }
              });
          });
      }
    });
  }
});
