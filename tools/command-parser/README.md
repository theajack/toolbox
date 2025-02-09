<!--
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 10:41:09
 * @Description: Coding something
-->
# Command Parser

Parse Command line and process.argv.

[Demo](https://shiyix.cn/jsbox/?github=theajack.toolbox/tools/command-parser)

## Usage

```
npm install command-parser
```

`parseCommand`

```js
import {parseCommand} from "command-parser";
const commands = parseCommand(`
    node index.js -D |
    npm install
`);
```

result is 

```
[
  {
    "name": "node",
    "args": [
      "index.js"
    ],
    "options": {
      "D": true
    }
  },
  {
    "name": "npm",
    "args": [
      "install"
    ],
    "options": {}
  }
]
```

`parseArgv`

This is only for nodejs

```js
import {parseArgv} from "command-parser";
const command = parseArgv();
```

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/command-parser"></script>
<script>console.log(window.CommandParser) </script>
```
