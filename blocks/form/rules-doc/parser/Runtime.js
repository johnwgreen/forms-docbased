/** ***********************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2022 Adobe
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
import functions from './functions.js';

export default class Runtime {
  constructor(debug, customFunctions) {
    const funs = functions(debug);
    this.functionTable = { ...funs, ...customFunctions };
  }

  callFunction(name, resolvedArgs, data, interpreter) {
    // this check will weed out 'valueOf', 'toString' etc
    if (!Object.prototype.hasOwnProperty.call(this.functionTable, name)) throw new Error(`Unknown function: ${name}()`);

    const functionEntry = this.functionTable[name];
    // eslint-disable-next-line no-underscore-dangle
    return functionEntry._func.call(functionEntry, resolvedArgs, data, interpreter);
  }
}
