/** ***********************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.

 * Adobe permits you to use and modify this file solely in accordance with
 * the terms of the Adobe license agreement accompanying it.
 ************************************************************************ */
import {
  getValueOf, getToNumber,
} from './utils.js';

export default function functions(debug) {
  const toNumber = getToNumber(debug);
  const fnMap = {
    and: {
      _func: (resolvedArgs) => {
        let result = !!getValueOf(resolvedArgs[0]);
        resolvedArgs.slice(1).forEach((arg) => {
          result = result && !!getValueOf(arg);
        });
        return result;
      },
    },

    false: {
      _func: () => false,
    },

    if: {
      _func: (unresolvedArgs, data, interpreter) => {
        const conditionNode = unresolvedArgs[0];
        const leftBranchNode = unresolvedArgs[1];
        const rightBranchNode = unresolvedArgs[2];
        const condition = interpreter.visit(conditionNode, data);
        if (getValueOf(condition)) {
          return interpreter.visit(leftBranchNode, data);
        }
        return interpreter.visit(rightBranchNode, data);
      },
    },

    not: {
      _func: (resolveArgs) => !getValueOf(resolveArgs[0]),
    },

    or: {
      _func: (resolvedArgs) => {
        let result = !!getValueOf(resolvedArgs[0]);
        resolvedArgs.slice(1).forEach((arg) => {
          result = result || !!getValueOf(arg);
        });
        return result;
      },
    },

    true: {
      _func: () => true,
    },

    power: {
      _func: (args) => {
        const base = toNumber(args[0]);
        const power = toNumber(args[1]);
        return base ** power;
      },
    },

    round: {
      _func: (args) => {
        const num = toNumber(args[0]);
        const digits = toNumber(args[1]);
        const precision = 10 ** digits;
        return Math.round(num * precision) / precision;
      },
    },

    ceiling: {
      _func: (args) => {
        const num = toNumber(args[0]);
        const significance = toNumber(args[1]);
        if (num === 0 || significance === 0) {
          return 0;
        }
        return Math.ceil(num / significance) * significance;
      },
    },

    min: {
      _func: (args) => {
        // flatten the args into a single array
        const array = args.reduce((prev, cur) => {
          if (Array.isArray(cur)) prev.push(...cur);
          else prev.push(cur);
          return prev;
        }, []);

        const first = array.find((r) => r !== null);
        if (array.length === 0 || first === undefined) return null;
        // use the first value to determine the comparison type
        const isNumber = !Number.isNaN(parseInt(first, 10));
        const compare = isNumber
          ? (prev, cur) => {
            const current = toNumber(cur);
            return prev <= current ? prev : current;
          }
          : (prev, cur) => {
            const current = toString(cur);
            return prev.localeCompare(current) === 1 ? current : prev;
          };

        return array.reduce(compare, isNumber ? toNumber(first) : toString(first));
      },
    },

    sum: {
      _func: (args) => args.reduce((sum, x) => {
        if (Array.isArray(x)) return sum + fnMap.sum.func(x);
        return sum + toNumber(x);
      }, 0),
    },
  };
  return fnMap;
}
