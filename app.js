var fs = require('fs');
var walkSync = require('walk-sync');
// var iconv = require('iconv-lite');
var path = require('path');
var mkdirp = require('mkdirp');

var html2md = require('./lib/html2md');


/**
 * 1. 遍历目标目录
 * 2. 获取每个html中的title信息
 * 3. 将html转义为md，然后以title.md.txt格式保存在指定目录
 *
 * 注意另存为之后的目录结构也要保持一致。
 */


/**
 * 遍历某路径下所有的文件。
 * @param {string} paths 路径
 * @return {function} 回调，接收一个参数item: {basePath,relativePath,size,mtime,mode}
 * Entry {
  relativePath: 'decodeURI.html',
  basePath: 'G:/991.git/oschina/local-html-project/api/javascript',
  mode: 33206,
  size: 1403,
  mtime: 1449528759429 }
 * @see https://www.npmjs.com/package/walk-sync
 */
function walk(paths, callback) {
    var entry = walkSync.entries(paths, {
        directories: false
    });

    entry.forEach(function(item) {
        callback(item);
    });
}

function htmlSaveAsMd(htmlPath, mdPath) {
    // 需要处理mdPath，因为可能它不存在
    mkdirp(mdPath, function(err) {
        if (err) {
            console.error('mkdirp error: ', err);
            return;
        }

        // 遍历htmlPath，逐一处理所有的文件
        walk(htmlPath, function(item) {
            // 获取文件内容
            // console.log(item);
            var filePath = path.join(item.basePath, item.relativePath);
            var content = fs.readFileSync(filePath, 'utf8');
            // console.log(content);

            // 获取要保存的文件名
            var reg = /<!--\[(.*)\]-->/,
                regResult = content.match(reg),
                saveFileName;
            if (regResult && regResult.length > 1) {
                saveFileName = JSON.parse(regResult[1]).title;
            } else {
                saveFileName = path.basename(filePath, '.html');
            }

            // 增加后缀
            saveFileName = saveFileName + '.md';

            // 将html转换为md
            var mdContent = html2md.convert(content);
            // console.log(mdContent);

            // 保存
            var mdSavePath = path.join(mdPath, saveFileName);
            fs.writeFile(mdSavePath, mdContent, (err) => {
                if (err) {
                    throw err;
                }
                console.log(mdSavePath + ' saved!');
            });
        });
    });
}


//----test-----
var htmlPath = './test/fixtures';
var mdPath = './test/expected';
htmlSaveAsMd(htmlPath, mdPath);