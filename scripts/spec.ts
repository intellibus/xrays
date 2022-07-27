import glob from 'glob';

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const main = async () => {
  const files = glob
    .sync('test/**/*.spec.ts')
    .concat(glob.sync('src/**/*.spec.ts'));
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const { run } = await import(`../${file}`);
    run();
    // eslint-disable-next-line no-await-in-loop
    await delay(100);
  }
};

main();
