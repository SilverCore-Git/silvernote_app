import { ref } from "vue";
import type { AppError } from "./types";

const errors = ref<AppError[]>([]);

const activeErrorIndex = ref<number | null>(null);

const postError = (err: Omit<AppError, "id" | "timestamp" | "show">) => {
    const newError: AppError = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        show: true,
        little: false,
        ...err,
    };

    errors.value.push(newError);
    activeErrorIndex.value = errors.value.length - 1;
};

const closeError = (index: number) => {
  if (errors.value[index]) {
    errors.value[index].little = true;
  }
};


export { closeError, errors, activeErrorIndex, postError }
export type { AppError };
export default postError;
