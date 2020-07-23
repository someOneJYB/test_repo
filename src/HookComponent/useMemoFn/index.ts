import { useRef, useCallback } from 'react';

type noop = (...args: any[]) => any;
export default function useMemoFn<T extends noop>(fn:T, args?:any) {
    const ref = useRef<any>(() => {
        throw new Error('Cannot call an event handler while rendering.');
    });
    ref.current = fn;
    return useCallback(() => {
        return ref.current(...args);
    }, [ref]);
}
