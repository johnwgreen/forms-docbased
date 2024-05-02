/* eslint-env mocha */
import assert from 'assert';
import { setValue } from '../../testUtils.js';

export const sample = {
  items: [
    {
      fieldType: 'text-input',
      id: 'text-input',
      name: 'name',
      events: {
        change: [
          "if(contains($event.payload.changes[].propertyName, 'value'), [dispatchEvent(numberinput, 'custom:setProperty', {required : true()}), dispatchEvent(checkboxgroup, 'custom:setProperty', {required : true()}) ,  dispatchEvent(dropdown, 'custom:setProperty', {required : true()}),  dispatchEvent(radiogroup, 'custom:setProperty', {required : true()})],{})",
        ],
        'custom:setProperty': [
          '$event.payload',
        ],

      },
    },
    {
      fieldType: 'number-input',
      id: 'number-input',
      name: 'numberinput',
      default: '123',
      events: {
        'custom:setProperty': [
          '$event.payload',
        ],
      },
    },
    {
      fieldType: 'checkbox-group',
      id: 'checkbox-group',
      name: 'checkboxgroup',
      enum: [
        '0',
        '1',
      ],
      events: {
        'custom:setProperty': [
          '$event.payload',
        ],
      },
    },
    {
      fieldType: 'drop-down',
      id: 'drop-down',
      name: 'dropdown',
      events: {
        'custom:setProperty': [
          '$event.payload',
        ],
      },
    },
    {
      fieldType: 'radio-group',
      id: 'radio-group',
      name: 'radiogroup',
      enum: [
        'a',
        'b',
      ],
      events: {
        'custom:setProperty': [
          '$event.payload',
        ],
      },
    },
  ],
};

function getValue(block, id, fieldType, property = 'disabled') {
  const fieldEl = block.querySelector(id);
  // ('invoked getter for', property);
  if (fieldType === 'checkbox-group' || fieldType === 'radio-group') {
    const child = fieldEl.querySelector(`input[name=${fieldEl.id}]`);
    return child[property];
  }
  return fieldEl[property];
}

export function op(block) {
  setValue(block, '#text-input', 'abc');
}

export function expect(block) {
  assert.equal(getValue(block, '#number-input', 'number-input', 'required'), true);
  assert.equal(getValue(block, '#checkbox-group', 'checkbox-group', 'required'), true);
  assert.equal(getValue(block, '#drop-down', 'drop-down', 'required'), true);
  assert.equal(getValue(block, '#radio-group', 'radio-group', 'required'), true);
}
