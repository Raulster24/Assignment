function promiseAllWithThreshold(arrayOfPromises, threshold) {
    let numRejected = 0;
    let results = [];
    if (threshold === 0) {
        return Promise.resolve([]);
      }
  
    return Promise.all(arrayOfPromises.map((promise) => {
      return promise.then((result) => {
        results.push(result);
        return { result: result, rejected: false };
      }).catch((error) => {
        numRejected++;
        return { result: error, rejected: true };
      });
    })).then((values) => {
      const rejectedPromises = values.filter((value) => value.rejected);
      if (rejectedPromises.length <= threshold) {
        return results;
      } else {
        throw new Error(`Too many rejections (${rejectedPromises.length})`);
      }
    });
  }

  const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('Result 1'), 1000);
  });
  
  const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => reject('Error 2'), 500);
  });
  
  const promise3 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('Result 3'), 1500);
  });
  
  // Calling promiseAllWithThreshold
  promiseAllWithThreshold([promise1, promise2, promise3], 0)
    .then((results) => {
      console.log(results);
    })
    .catch((error) => {
      console.error(error);
    });

  module.exports =  promiseAllWithThreshold ;