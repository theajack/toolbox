<!--
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 10:41:09
 * @Description: Coding something
-->
# Tab-Text

Make the textarea support Tab indentation.

[Demo](https://shiyix.cn/jsbox/?github=theajack.toolbox/tools/tab-text)

## Usage

```
npm install tab-text
```

`useTab`

```js
import {useTab} from "tab-text";
useTab('#text');
```

use `onKeyDown`

```js
import {onKeyDown} from "tab-text";
document.getElementById('text').addEventListener('keydown', onKeyDown);
```

`setTabValue`

```js
import {setTabValue} from "tab-text";
setTabValue('\t');
```

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/tab-text"></script>
<script>console.log(window.TabText) </script>
```
