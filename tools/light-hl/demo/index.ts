/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 13:32:53
 * @Description: Coding something
 */
import {highlight, HighLight} from '..';

// const html = highlight('console.log("Hello World!");');
const html = highlight(`
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
console.log(11);
`);
document.getElementById('container')!.innerHTML = html;
document.getElementById('container2')!.appendChild(HighLight({
    code: `function main(){
    console.log("Hello World!");
    console.log("Hello World!");
    console.log("Hello World!");
    console.log("Hello World!");
    console.log("Hello World!");
    console.log("Hello World!");
}`,
    highlights: [{
        match: /main/g,
    }]
}));

document.body.appendChild(HighLight({
    code: `function main(){
    console.log("Hello World!");
}`,
    highlights: [{
        match: /main/g,
    }]
}));