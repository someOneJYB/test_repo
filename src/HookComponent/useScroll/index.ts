import { useEffect, useState } from 'react';

interface Position {
    left: number;
    top: number;
}
export default function useScroll(el?:HTMLElement): Position {
    const [position, setPosition] = useState({
        left: NaN,
        top: NaN,
    });
    useEffect(() => {
       let dom;
       if(!el) {
          dom = window;
       }
       function scrollListener(e:Event){
           if(!e) return
           updatePosition(e.target)
       }
       function updatePosition (target) {
            let pos;
            if(target === document) {
                pos =  {
                    left: document.scrollingElement.scrollLeft,
                    top: document.scrollingElement.scrollTop,
                }
            } else {
                pos =  {
                    left: target.scrollLeft,
                    top: target.scrollingElement.scrollTop,
                }
            }
            setPosition(pos);
       }
       updatePosition(el)
       dom.addEventListener('scroll', scrollListener, false)
       return () => {
           dom.removeEventListener('scroll', scrollListener, false)
       }

    }, [el ? undefined : el])
    return position;
}
