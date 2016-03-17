//https://www.npmjs.com/package/to-markdown
var toMarkdown = require('to-markdown');

function cell(content, node) {
    var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
    var prefix = ' ';
    if (index === 0) {
        prefix = '| ';
    }
    return prefix + content + ' |';
}


// 修正如果tr没在thead时，没有标题的bug
var convertTr = {
    filter: 'tr',
    replacement: function(content, node) {
        var borderCells = '';
        var alignMap = {
            left: ':--',
            right: '--:',
            center: ':-:'
        };

        if (node.parentNode.nodeName === 'THEAD' || node.childNodes[0].nodeName === 'TH') {
            for (var i = 0; i < node.childNodes.length; i++) {
                var align = node.childNodes[i].attributes.align;
                var border = '---';

                if (align) {
                    border = alignMap[align.value] || border;
                }

                borderCells += cell(border, node.childNodes[i]);
            }
        }
        return '\n' + content + (borderCells ? '\n' + borderCells : '');
    }
};


// pre blocks
var convertPre = {
    filter: function(node) {
        return node.nodeName === 'PRE' && (!node.firstChild || node.firstChild.nodeName !== 'CODE');
    },
    replacement: function(content, node) {
        return '`' + content + '`';
    }
};

// Code blocks
var convertCode = {
    filter: function(node) {
        return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
    },
    replacement: function(content, node) {
        var css = node.firstChild.className,
            matchResult = [],
            language = '';

        // 获得语言
        if (css && (matchResult = css.match(/\s*language-(.*)/)) && matchResult.length > 1) {
            language = matchResult[1].trim();
        }

        return '\n\n```' + language + '\n' + node.firstChild.textContent + '\n```\n\n';
    }
};


/**
 * 处理下面的组件
 * <div class="note note-info"></div>
 */
var convertCustomNote = {
    filter: function(node) {
        return node.nodeName === 'DIV' && node.className && node.className.indexOf('note ') > -1;
    },
    replacement: function(content, node) {
        var css = node.className,
            matchResult = [],
            type = 'info',
            tag = '';

        // 获得语言
        if (css && (matchResult = css.match(/\s*note-(.*)/)) && matchResult.length > 1) {
            type = matchResult[1].trim();
        }

        content = content.trim();
  
        // 非info场景下要设置下type，以方便后续渲染
        if (type !== 'info') {
            tag = '*[' + type + ']* ：';
        }

        return '\n> ' + tag + content + '\n';
    }
};

exports.convert = function(content) {
    return toMarkdown(content, {
        gfm: true,
        converters: [convertTr, convertPre, convertCode, convertCustomNote]
    });
};
