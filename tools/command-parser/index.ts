/*
 * @Author: chenzhongsheng
 * @Date: 2025-02-09 17:46:37
 * @Description: Coding something
 */

export function parseArgv () {
    if (typeof process === 'undefined' || !process.argv) {
        throw new Error('process.argv is undefined');
    }
    return parseCommand(process.argv.join(' '))[0];
}

export interface ICommandInfo {
    name: string;
    args: string[];
    options: Record<string, string|boolean>;
    line: string;
}

// 解析 rm --rf a -rf x -ab 类似的 => {rf: 'a', r: 'x', f: 'x', a: true, b: true}
// -- 结束 options 解析
// forceArg=true时 :xxx 会被强制标识为arg
export function parseCommand (content: string, forceArg = true): ICommandInfo[] {

    content = content.trim();

    if (!content) return [];

    const values = content.split('|').map(v => v.trim());
    const commands: ICommandInfo[] = [];
    for (const value of values) {
        const command: ICommandInfo = {
            name: '',
            args: [],
            options: {},
            line: value,
        };
        const arr = value.split(' ');

        command.name = arr.shift() || '';

        let optKey = '', isLong = false;

        const addOptions = (value: string|true) => {
            if (forceArg && typeof value === 'string' && value[0] === ':') {
                command.args.push(value.substring(1));
                value = true;
            }
            if (isLong) {
                command.options[optKey] = value;
            } else {
                for (const v of optKey) {
                    command.options[v] = value;
                }
            }
        };

        const setOptKey = (value: string) => {
            optKey = value.substring(isLong ? 2 : 1);
        };
        const setLong = (value: string) => {
            isLong = value[1] === '-';
        };

        let optionsSplit = false;
        for (let item of arr) {
            item = item.trim();
            if (!item) continue;
            if (optionsSplit) {
                command.args.push(item);
                continue;
            }
            if (item === '--') {
                optionsSplit = true;
                continue;
            }
            if (item[0] === '-') {
                setLong(item);
                if (optKey) addOptions(true);
                setOptKey(item);
            } else {
                if (optKey) {
                    if (item[0] === '-') {
                        setLong(item);
                        addOptions(true);
                        setOptKey(item);
                    } else {
                        addOptions(item);
                        optKey = '';
                    }
                } else {
                    command.args.push(item);
                }
            }
        }

        if (optKey) {
            addOptions(true);
        }
        commands.push(command);
    }
    return commands;
}