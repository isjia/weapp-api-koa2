func2();

async function func2() {
  try {
    await func4();
  } catch (error) {
    console.log('error >>>>>>>>>> ', error);
  }
}

function func3 () {
  try {
    console.log(0/a);
  } catch (error) {
    throw error;
  }
  return 'success';
}

function func4 () {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      const r = Math.random();
      console.log(r);
      if (r < 0.5) {
        reject('error');
      } 
    }, 1000);
  });
}