import { useEffect, useRef } from "react";

export const useEffectOnce = (effect) => {
    const effectCalled = useRef(false);

    useEffect(() => {
        if (!effectCalled.current) {
            effect();
            effectCalled.current = true;
        }
    }, []);
};