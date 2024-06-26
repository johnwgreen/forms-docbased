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
export function getValueOf(a) {
  if (a === null || a === undefined) return a;
  if (Array.isArray(a)) {
    return a.map((i) => getValueOf(i));
  }
  return a.valueOf();
}

const defaultStringToNumber = ((str) => {
  const n = +str;
  return Number.isNaN(n) ? 0 : n;
});

export function getToNumber(debug = []) {
  return (value) => {
    const n = getValueOf(value); // in case it's an object that implements valueOf()
    if (n === null) return null;
    if (Array.isArray(n)) {
      debug.push('Converted array to zero');
      return 0;
    }
    const type = typeof n;
    if (type === 'number') return n;
    if (type === 'string') return defaultStringToNumber(n, debug);
    if (type === 'boolean') return n ? 1 : 0;
    debug.push('Converted object to zero');
    return 0;
  };
}
