export function useWait() {
  const waits = useState<Record<string, number>>(
    'waits',
    () => ({}),
  );

  const start = (key: string) => {
    waits.value[key] = (waits.value[key] ?? 0) + 1;
  };

  const end = (key: string) => {
    const nextValue = (waits.value[key] ?? 0) - 1;

    if (nextValue > 0) {
      waits.value[key] = nextValue;
      return;
    }

    delete waits.value[key];
  };

  const isWaiting = (key: string) =>
    computed(() => (waits.value[key] ?? 0) > 0);

  const wait = async <T>(
    key: string,
    action: () => Promise<T>,
  ): Promise<T> => {
    start(key);

    try {
      return await action();
    } finally {
      end(key);
    }
  };

  return {
    isWaiting,
    wait,
  };
}
