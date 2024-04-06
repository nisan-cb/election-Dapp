import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context";
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MIN_IN_MS = 60 * 1000;
const HOUR_IN_MS = MIN_IN_MS * 60

const AdminPanel = () => {
    const { electionContract, currentAccount } = useContext(AppContext);

    const [newCandidateName, setNewCandidateName] = useState('');

    const [startTime, setStartTime] = useState(Date.now());
    const [endTime, setEndTime] = useState(Date.now() + HOUR_IN_MS);

    useEffect(() => {
        console.log(startTime)
    }, [startTime])



    const addCandidateHandler = async () => {
        if (!electionContract) return

        const res = await electionContract.methods.addCandidate(newCandidateName).send({ from: currentAccount });
        setNewCandidateName('');

    }

    const restartHandler = async () => {
        if (!electionContract) return

        const res = await electionContract.methods.reset().send({ from: currentAccount });
    }

    const setTimeHandler = async () => {
        if (!electionContract) return
        const res = await electionContract.methods.setTime(Math.floor(startTime / 1000), Math.floor(endTime / 1000)).send({ from: currentAccount });
        console.log(res)
    }

    return (
        <>
            <h1>Admin Panel</h1>

            <input type="text" placeholder="Candidate name" value={newCandidateName} onChange={e => setNewCandidateName(e.target.value)} />
            <button onClick={addCandidateHandler}>Add</button>
            <button onClick={restartHandler}>Restart</button>
            <p>Set Time</p>

            <LocalizationProvider dateAdapter={AdapterDayjs}>


                <DemoItem label="Start Time">
                    <MobileTimePicker ampm={false} defaultValue={dayjs(startTime)} value={dayjs(startTime)} onChange={e => setStartTime(e?.toDate().getTime()!)} />
                </DemoItem>

                <DemoItem label="End Time">
                    <MobileTimePicker ampm={false} defaultValue={dayjs(endTime)} value={dayjs(endTime)} onChange={e => setEndTime(e?.toDate().getTime()!)} />
                </DemoItem>
            </LocalizationProvider>
            <button onClick={setTimeHandler}>Set Time</button>

        </>


    )
}


export default AdminPanel;