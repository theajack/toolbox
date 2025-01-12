<!--
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 10:41:09
 * @Description: Coding something
-->
# Light-HL

A Lightweight HightLight Library

[Demo](https://shiyix.cn/jsbox/?github=theajack.toolbox/tools/light-hl)

## Usage

```
npm install light-hl
```

`highlight`

```js

import {highlight} from 'light-hl';
const html = highlight('console.log("Hello World!");');
document.body.innerHTML = html;
```

`HighLight`

```js
import {HighLight} from 'light-hl';

document.body.appendChild(HighLight({
    code: 'function main(){\n  console.log("Hello World!");\n}',
    highlights: [{
        match: /main/g,
    }]
}));
```

HightLight Options 

```ts
interface IHighLightBase {
	color?: string;
	opacity?: number;
}
interface IHighLightPosition extends IHighLightBase {
	row: number;
	column: number;
	range?: number;
}
interface IHighLightMatch extends IHighLightBase {
	match: string | RegExp;
}
type IHighLight = IHighLightPosition | IHighLightMatch;
declare function HighLight(options?: {
	code?: string;
	borderRight?: boolean;
	startIndex?: number;
	highlights?: IHighLight[];
	style?: IStyle;
	codeStyle?: IStyle;
	lineHeight?: number;
	lineCount?: number;
}): HTMLElement;
```

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/light-hl"></script>
<script>console.log(window.LightHl) </script>
```
