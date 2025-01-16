/*
 * @Author: chenzhongsheng
 * @Date: 2024-08-18 10:22:55
 * @Description: Coding something
 */
import '../../../build/env.d';
declare global {
    interface Console {
        tc(...args: any[]): void;
    }
}

export {};