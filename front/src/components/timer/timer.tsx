import { useContext } from "react";
import { AppContext } from "../../context";
import { formatTime } from "../../services/time";


const Timer = () => {
    const { startTimeInMs, endTimeInMs, timeToEnd, timeToStart } = useContext(AppContext);

    const displayStartTimer = () => {
        return <>Time to start: {formatTime(timeToStart)}</>
    }

    const displayEndTimer = () => {
        if (Date.now() > endTimeInMs)
            return <>The elections are close</>
        else
            return <>Time to end: {formatTime(timeToEnd)}</>

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
