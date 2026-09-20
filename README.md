> Upstream: https://github.com/component/escape-html @ b42947eefa79efff01b3fe988c4c7e7b051ec8d8 (MIT). Slim fork for GSB Mode A green init.

# escape-html

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

  Escape string for use in HTML

This module exports a single function, `escapeHtml`, that is used to escape
a string of content such that it can be interpolated in HTML content.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install escape-html
```

## API

### escapeHtml(string)

Escape special characters in the given string of text, such that it can be
interpolated in HTML content.

This function will escape the following characters: `"`, `'`, `&`, `<`, and
`>`.

**Note** that the escaped value is only suitable for being interpolated into
HTML as the text content of elements in which the tag does not have different
escaping mechanisms (it cannot be placed inside `<style>` or `<script>`, for
example, as those content bodies are not HTML, but CSS and JavaScript,
respectively; these are known as "raw text elements" in the HTML standard).

**Note** when using the escaped value within a tag, it is only suitable as
the value of an attribute, where the value is quoted with either a double
quote character (`"`) or a single quote character (`'`).

## 转义语义（中文）

本库只转义五类字符，匹配字符集等价于 `["'&<>]`，映射固定为：

- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#39;`（使用数字实体，**不使用** `&apos;`）

关键实现约定：

- **先处理 `&`，防止二次转义**：若采用多次 `String#replace`，必须先替换 `&`，
  否则后续插入的 `&lt;`、`&quot;` 等实体会被末尾的 `&` 替换打成
  `&amp;lt;`、`&amp;quot;`。本实现直接按码点（`charCodeAt`）单遍扫描原始字符串，
  每个字符只检查一次，从根本上不存在对已生成实体再次转义的问题。
- **「已安全」快路径**：仅当字符串不含上述任何一个特殊字符时才原样返回；
  不能因为缺少 `<` / `>` 就跳过 `&`、`'`、`"` 的转义。
- **非字符串强制字符串化**：入参先经 `'' + string` 转换，因此
  `undefined` → `'undefined'`、`null` → `'null'`、`42` → `'42'`、
  `{}` → `'[object Object]'`，绝不直接返回原始 number/object。
- **混合串全量转义**：替换是全局的（每个特殊字符都处理，而非只处理首个）。
  例如 `escapeHtml('&foo <> bar "fizz" l\'a')` 严格等于
  `'&amp;foo &lt;&gt; bar &quot;fizz&quot; l&#39;a'`。

### 测试

运行 `npm test`（mocha，`--check-leaks --reporter spec test/`），真实结果摘要：

```
  30 passing
```

## Example

The `escapeHtml` function is designed to accept a string input of text and
return an escaped value to interpolate into HTML.

```js
var escapeHtml = require('escape-html')

// example values
var desc = 'I <b>think</b> this is good.'
var fullName = 'John "Johnny" Smith'

// example passing in text into a html attribute
console.dir('<input name="full_name" value="' + escapeHtml(fullName) + '">')
// -> '<input name="full_name" value="John &quot;Johnny&quot; Smith">'

// example passing in text in html body
console.dir('<textarea name="desc">' + escapeHtml(desc) + '</textarea>')
// -> '<textarea name="desc">I &lt;b&gt;think&lt;/b&gt; this is good.</textarea>'
```

## Benchmark

```
$ npm run-script bench

> escape-html@1.0.3 bench nodejs-escape-html
> node benchmark/index.js


  http_parser@1.0
  node@0.10.33
  v8@3.14.5.9
  ares@1.9.0-DEV
  uv@0.10.29
  zlib@1.2.3
  modules@11
  openssl@1.0.1j

  1 test completed.
  2 tests completed.
  3 tests completed.

  no special characters    x 19,435,271 ops/sec ±0.85% (187 runs sampled)
  single special character x  6,132,421 ops/sec ±0.67% (194 runs sampled)
  many special characters  x  3,175,826 ops/sec ±0.65% (193 runs sampled)
```

## License

[MIT](LICENSE)

[coveralls-image]: https://badgen.net/coveralls/c/github/component/escape-html/master
[coveralls-url]: https://coveralls.io/r/component/escape-html?branch=master
[npm-downloads-image]: https://badgen.net/npm/dm/escape-html
[npm-url]: https://npmjs.org/package/escape-html
[npm-version-image]: https://badgen.net/npm/v/escape-html
[travis-image]: https://badgen.net/travis/component/escape-html/master
[travis-url]: https://travis-ci.org/component/escape-html
