import { ref } from "vue";
import type { AppError } from "./types";
import sentErrorToDiscord from "./sentErrorToDiscord";

const errors = ref<AppError[]>([]);
const activeErrorIndex = ref<number | null>(null);

function extractMessage(err: unknown): string {
  if (err instanceof DOMException) {
    return `${err.name}: ${err.message}`;
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  try {
    return JSON.stringify(err);
  } catch {
    return "Erreur inconnue";
  }
}

const postError = (params: {
  message?: string;
  place?: string;
  error?: "400" | "500" | "unknow";
  more?: string;
  raw?: unknown;
}) => {
  const finalMessage = params.message ?? extractMessage(params.raw);

  const newError: AppError = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    show: true,
    little: false,

    message: finalMessage,
    place: params.place,
    error: params.error ?? "unknow",
    more: params.more,
  };

  errors.value.push(newError);
  activeErrorIndex.value = errors.value.length - 1;

  sentErrorToDiscord(newError);
};

const closeError = (index: number) => {
  if (errors.value[index]) {
    errors.value[index].little = true;
  }
};

export { closeError, errors, activeErrorIndex, postError };
export type { AppError };
export default postError;
