
function cbl (x, cb) {
  console.log('2')
  setTimeout(() => {
    console.log('3')
    cb(x * 2);
  }, 2000);
}

function doubleAfter2Seconds(x) {
  return new Promise(resolve => {
    console.log('1')
    cbl(x, (r) => {
      console.log('4')
      resolve(r);
    });
  });
}

async function addAsync(x) {
  const a = await doubleAfter2Seconds(10);
  const b = await doubleAfter2Seconds(20);
  const c = await doubleAfter2Seconds(30);
  return x + a + b + c;
}


addAsync(10).then((sum) => {
  console.log(sum);
});