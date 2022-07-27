import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { x } from '../src';

const test = suite('Basic Xrays Schema');

const throwable = async (shouldThrow: boolean) => {
  if (shouldThrow) {
    throw new Error('A Not So Nice Error Message');
  }
  return 'Some Really Cool Data';
};

test('Passing Function Returns Data', async () => {
  const { data, error } = await x(throwable, false);
  assert.equal(data, 'Some Really Cool Data');
  assert.equal(error, null);
});

test('Failing Function Returns Error', async () => {
  const { data, error } = await x(throwable, true);
  assert.equal(data, null);
  assert.equal(error, new Error('A Not So Nice Error Message'));
});

export const { run } = test;
