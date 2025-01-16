/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:21:18
 * @Description: Coding something
 */
const list: string[] = [];
const json = {
    all: 'all',
    error: 'error',
    warn: 'warn',
    log: 'log',
    info: 'info',
    tc: 'tc',
    html: 'html',
    list: [] as string[],
};
for (const k in json) {
    if (json[k] !== json.all) {
        list.push(json[k]);
    }
}
json.list = list;
export default json;