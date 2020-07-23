import { useEffect, useState } from 'react';

// function isInViewPort(el: HTMLElement): boolean {
//     if(!el) return false;
//     const { left, right, top, bottom } = el.getBoundingClientRect() || {};
//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;
//     if(!left && !top) return false;
//     return bottom > 0 && top <= windowHeight && left <= windowWidth && right > 0;
// }

export default function useInViewPort(el: HTMLElement, cb?:Function) : boolean {
    const [ isInViewPort, setInViewPort ] = useState<Boolean>(()=>isInViewPort(el));
    useEffect(()=>{
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    setInViewPort(true);
                    // 在可市区可见的函数回调
                    cb && cb()
                } else {
                    setInViewPort(false);
                }
            }
        });

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [typeof el === 'function' ? undefined : el])
    return isInViewPort
}
