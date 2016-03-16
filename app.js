var fs = require('fs');
var walkSync = require('walk-sync');
// var iconv = require('iconv-lite');
var path = require('path');
var mkdirp = require('mkdirp');

//https://www.npmjs.com/package/to-markdown
var toMarkdown = require('to-markdown');


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


var oldPath = 'G:/991.git/oschina/local-html-project/api/javascript2';
var newPath = 'D:/code/data/javascript';



mkdirp(newPath, function(err) {
    if (err) {
        console.error('mkdirp error: ', err);
        return;
    }

    console.log('newPath reasy!');

    walk(oldPath, function(item) {
        // console.log(item);
        var filePath = path.join(item.basePath, item.relativePath);
        var content = fs.readFileSync(filePath, 'utf8');
        // console.log(content);

        var reg = /<!--\[(.*)\]-->/;
        var regResult = content.match(reg);
        var saveFileName;
        if (regResult && regResult.length > 1) {
            saveFileName = JSON.parse(regResult[1]).title;
        } else {
            saveFileName = path.basename(filePath, '.html');
        }
        saveFileName = saveFileName + '.md.txt';
        console.log(saveFileName);

        console.log(toMarkdown(content, {
            gfm: true,
            converters: [{
                filter: 'li',
                replacement: function(content) {
                    return '- ' + content;
                }
            }]
        }));

        // TODO toMarkdown对pre处理不好，需要第二次转义。如果第一次就强制转的话，会导致code不会被转义
        // 渲染的表格有问题，

    });
});
