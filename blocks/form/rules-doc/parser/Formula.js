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
import Parser from './Parser.js';
import TreeInterpreter from './TreeInterpreter.js';
import Runtime from './Runtime.js';

export default class Formula {
  constructor(customFunctions) {
    this.debug = [];
    this.runtime = new Runtime(this.debug, customFunctions);
  }

  compile(stream) {
    let ast;
    try {
      const parser = new Parser();
      ast = parser.parse(stream, this.debug);
    } catch (e) {
      this.debug.push(e.toString());
      throw e;
    }
    return ast;
  }

  evaluate(node, data) {
    // This needs to be improved.  Both the interpreter and runtime depend on
    // each other.  The runtime needs the interpreter to support exprefs.
    // There's likely a clean way to avoid the cyclic dependency.
    this.runtime.interpreter = new TreeInterpreter(
      this.runtime,
      this.debug,
    );

    try {
      return this.runtime.interpreter.search(node, data);
    } catch (e) {
      this.debug.push(e.message || e.toString());
      throw e;
    }
  }
}
