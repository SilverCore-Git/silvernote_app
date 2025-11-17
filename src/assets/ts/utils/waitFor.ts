export default function waitFor
(conditionFn: () => boolean, timeout = 5000, interval = 300): Promise<boolean>
{
  return new Promise(resolve => {
    const start = Date.now();

    const check = () => {
      if (conditionFn()) return resolve(true);
      if (Date.now() - start >= timeout) return resolve(false);
      setTimeout(check, interval);
    };

    check();
  });
}
