const { expect } = require('chai');
const promiseAllWithThreshold = require('./promiseAllWithThreshold');


describe('promiseAllWithThreshold', () => {
  it('resolves with an array of resolved values when all promises are resolved', async () => {
    const promises = [
      Promise.resolve('foo'),
      Promise.resolve('bar'),
      Promise.resolve('baz'),
    ];
    const result = await promiseAllWithThreshold(promises, 1);
    expect(result).to.deep.equal(['foo', 'bar', 'baz']);
  });

  it('rejects with an error when any promises are rejected', async () => {
    const promises = [
      Promise.resolve('foo'),
      Promise.reject(new Error('rejected')),
      Promise.resolve('baz'),
    ];
    try {
      await promiseAllWithThreshold(promises, 1);
      throw new Error('rejected');
    } catch (err) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('rejected');
    }
  });

  it('rejects with an error when too many promises are rejected', async () => {
    const promises = [
      Promise.resolve('foo'),
      Promise.reject(new Error('rejected')),
      Promise.reject(new Error('rejected')),
    ];
    try {
      await promiseAllWithThreshold(promises, 1);
      throw new Error('Expected promise to reject');
    } catch (err) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Too many rejections (2)');
    }
  });

  it('resolves with an empty array when no promises are provided', async () => {
    const result = await promiseAllWithThreshold([], 1);
    expect(result).to.deep.equal([]);
  });

  it('resolves with an empty array when threshold is set to 0', async () => {
    const promises = [
      Promise.resolve('foo'),
      Promise.reject(new Error('rejected')),
      Promise.resolve('baz'),
    ];
    const result = await promiseAllWithThreshold(promises, 0);
    expect(result).to.deep.equal([]);
  });

  it('resolves with an array of resolved values when threshold is set to a high value', async () => {
    const promises = [
      Promise.resolve('foo'),
      Promise.reject(new Error('rejected')),
      Promise.resolve('baz'),
    ];
    const result = await promiseAllWithThreshold(promises, 10);
    expect(result).to.deep.equal(['foo', 'baz']);
  });
});
