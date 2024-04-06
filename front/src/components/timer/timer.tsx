import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context";
import { formatTime } from "../../services/time";


const Timer = () => {
    const { startTimeInMs, endTimeInMs } = useContext(AppContext);
    const now = Date.now();

    const [timerToStart, setTimerToStart] = useState(startTimeInMs - Date.now());
    const [timerToEnd, setTimerToEnd] = useState(endTimeInMs - Date.now());

    useEffect(() => {
        setTimerToStart(startTimeInMs - Date.now());
        setTimerToEnd(endTimeInMs - Date.now())
    }, [startTimeInMs, endTimeInMs])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimerToStart(prev => prev - 1000)
            setTimerToEnd(prev => prev - 1000)
        }, 1000);
        return () => {
            clearInterval(intervalId)
        }
    }, [])


    const displayStartTimer = () => {
        return <>Time to start: {formatTime(timerToStart)}</>
    }

    const displayEndTimer = () => {
        if (Date.now() > endTimeInMs)
            return <>The elections are close</>
        else
            return <>Time to end: {formatTime(timerToEnd)}</>

    }

    return (
        <div>
            {
                Date.now() < startTimeInMs ?
                    displayStartTimer()
                    :
                    displayEndTimer()
            }
        </div>
    )
}

export default Timer;
