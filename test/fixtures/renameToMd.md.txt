`Array.prototype.concat()` 方法用于将传入的数组或非数组值与原数组合并，组成一个新的数组并返回。

> 该方法不会改变原数组，而会返回一个新数组。

ddd

> *[warning]* ：该方法不会改变原数组，而会返回一个新数组。

## 定义和用法

### 语法

`arrayObject.concat(value1, value2, ..., valueN)`

| 参数 | 描述 |
| --- | --- |
| _valueN_ | 需要与原数组合并的数组或非数组值 |

### 返回值

返回一个新的数组。该数组是通过把所有 `valueN` 参数添加到 `arrayObject` 中生成的。

### 说明

`concat()` 方法并不修改调用它的对象(`this` 指向的对象) 和参数中的各个数组本身的值，而是将他们的每个元素拷贝一份放在组合成的新数组中。

对新数组的任何操作都不会对原数组产生影响，反之亦然。

原数组中的元素有两种被拷贝的方式：

1.  字符串和数字(是原始值，而不是包装原始值的 `String` 和 `Number` 对象)：`concat()` 方法会复制字符串和数字的值放到新数组里;
2.  对象引用(非对象直接量)：`concat()`方法会复制对象引用放到组合的新数组里,原数组和新数组中的对象引用都指向同一个实际的对象，所以，当实际的对象被修改时，两个数组也同时会被修改。

## 实例

### 例子 1：参数为元素

在本例中，我们将把 `concat()`中的参数连接到数组 `a` 中：

``` javascript

    var a = [1,2,3];
    var result = a.concat(4,5);

    console.log(a);  // [1, 2, 3] ，注意，数组a的值并没有发生改变！
    console.log(result);  // [1, 2, 3, 4, 5] 

```

## 更多

*   [Array.prototype.concat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
*   [JavaScript concat() 方法](http://www.w3school.com.cn/jsref/jsref_concat_array.asp)