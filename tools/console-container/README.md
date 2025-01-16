<!--
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 10:41:09
 * @Description: Coding something
-->
# ConsoleContainer

A Simple Console UI Panel

[Demo](https://shiyix.cn/jsbox/?github=theajack.toolbox/tools/console-container)

## Usage

```
npm install console-container
```

```js
import {Console} from 'console-container';
new Console({
    container: '#container',
});
```

```ts
interface Options {
    container: HTMLElement | string;
    needCopy?: boolean;
    mode?: "light" | "dark";
}
```

API

```ts
{
    setMode(mode: "light" | "dark"): void;
    setVisible(bool: boolean, style?: string): void;
    init(): void;
    filterLog(v: string): void;
}
```

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/console-container"></script>
<script>console.log(window.ConsoleContainer) </script>
```
