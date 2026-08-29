import { useCallback, useState } from "react";

export function useLocalStorageList(getter, mutator) {
  const [list, setList] = useState(getter());

  const mutate = useCallback(
    (arg) => {
      const next = mutator(arg);
      setList(next);
      return next;
    },
    [mutator]
  );

  return [list, mutate];
}
