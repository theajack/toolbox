/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 14:07:20
 * @Description: Coding something
 */


export function createMeasureText (font: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = font;
    
    return (text: string) => {
        if (!text) return 0;
        return ctx.measureText(text).width;
    };
}