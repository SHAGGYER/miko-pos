import React, {useEffect, useState} from "react";

export const useInfiniteScroll = (elementQuery, callback, hasMore, offset, direction, perPage) => {
    const [busy, setBusy] = useState(false);
    const [state, setState] = useState([]);
    const [element, setElement] = useState(null)


    useEffect(() => {
        const element = document.querySelector(elementQuery)
        setElement(element)

        let handler = async () => {
            if (
                element &&
                (direction === "top" ?
                    offset > 0 ? element.scrollTop < offset
                        : element.scrollTop === 0
                    : element.scrollTop > element.scrollHeight - element.clientHeight - offset) &&
                hasMore &&
                !busy
            ) {
                if (hasMore && !busy) {
                    setBusy(true)
                    await callback()
                }

                setBusy(false)
            }
        };

        if (state.length) {
            if (
                element &&
                hasMore
            ) {
                element.addEventListener("scroll", handler);
            }
        }

        return () => {
            if (element) {
                element.removeEventListener("scroll", handler);

            }
        };
    }, [state, hasMore, busy]);

    const onLoad = () => {
        if (direction === "top") {
            if (state.length === 0) {
                const element = document.querySelector(elementQuery)
                element.scrollTop = element.scrollHeight - element.clientHeight
            }
        }

        if (state.length) {
            const lastMessageElm = element.childNodes[perPage];
            if (lastMessageElm && direction === "top") {
                lastMessageElm.scrollIntoView();
                if (offset > 0) {
                    element.scrollTop += offset
                }
            }
        }
    }

    return [
        state,
        setState,
        {busy, setBusy, onLoad}
    ]
}