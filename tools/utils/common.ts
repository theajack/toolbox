/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 14:07:20
 * @Description: Coding something
 */


let ctx: CanvasRenderingContext2D|null;
export function measureText (text: string) {
    if (!text) return 0;
    if (!ctx) {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d')!;
        ctx.font = '15px courier-new, courier, monospace';
    }
    return ctx.measureText(text).width;
}