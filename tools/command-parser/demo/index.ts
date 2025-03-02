/*
 * @Author: chenzhongsheng
 * @Date: 2025-03-02 15:30:23
 * @Description: Coding something
 */
import {parseCommand} from '../index';

// console.log(
//     parseCommand('rm --rf a -rf x -ab')
// );

const line = 'rm --rf --xx a -rf \:a  -- x -ab';
console.log(line);
console.log(
    parseCommand(line)
);