import { defaultFilter, SavingsFilterParamsMap } from '../interfaces/saving.interface';
import { EffectCallback } from 'react';

export function arrayEquals(a: any, b: any) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

export function getSavingsFilter(accountId: number, savingsFilterMap: SavingsFilterParamsMap) {
  let savingsFilter = savingsFilterMap[accountId];
  if (!savingsFilter) {
    savingsFilter = defaultFilter;
  }
  return savingsFilter;
}

export function useEffectCallback(options: EffectOptions): EffectCallback {
  return () => {
    // clean up controller
    let isSubscribed = true;

    // try to communicate with server API
    if (isSubscribed) {
      options.asyncFunctions.forEach((asyncFunc, index) => {
        asyncFunc()
          .then((data: any) => isSubscribed ? options.successActions[index](data) : null)
          .catch((err: any) => {
            if (isSubscribed) {
              options.errorActions[index](err);
            }
          });
      });
    }

    // cancel subscription to useEffect
    return () => {
      isSubscribed = false
    };
  }
}

type EffectOptions = {
  asyncFunctions: Function[],
  successActions: Function[],
  errorActions: Function[]
}
