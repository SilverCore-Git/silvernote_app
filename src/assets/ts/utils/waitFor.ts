export default function waitFor
(
    conditionFn: () => boolean,
    timeout: number = 5_000,
    interval: number = 100
): Promise<boolean>
{
    return new Promise((resolve) => {
        const start = Date.now();

        const check = () => {
            if (conditionFn()) {
                resolve(true);
                return;
            }

            if (Date.now() - start >= timeout) {
                resolve(false);
                return;
            }

            setTimeout(check, interval);
        };

        check();
    });
}
