import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context";
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './style.css'
import Rating from "../rating/rating";

const MIN_IN_MS = 60 * 1000;
const HOUR_IN_MS = MIN_IN_MS * 60

const AdminPanel = () => {
    const { electionContract, currentAccount } = useContext(AppContext);

    const [newCandidateName, setNewCandidateName] = useState('');

    const [startTime, setStartTime] = useState(Date.now());
    const [endTime, setEndTime] = useState(Date.now() + HOUR_IN_MS * 0.5);
    const [quizState, setQuizState] = useState({ economy: 0, education: 0, security: 0 })


    const addCandidateHandler = async () => {
        if (!electionContract) return

        const res = await electionContract.methods.addCandidate(newCandidateName, quizState).send({ from: currentAccount });
        setNewCandidateName('');
        setQuizState({ economy: 0, education: 0, security: 0 })

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
            <h2>Admin Panel</h2>
            <br />
            <div className="col delimiter">
                <div className="row">
                    <input type="text" placeholder="Candidate name" value={newCandidateName} onChange={e => setNewCandidateName(e.target.value)} />
                    <button onClick={addCandidateHandler}>Add</button>
                </div>
                <div id="quiz-box">
                    <div className="rating-row">
                        Economy: <Rating value={quizState.economy} onChange={(val) => setQuizState(prev => ({ ...prev, economy: val }))} />
                    </div>
                    <div className="rating-row">
                        Education: <Rating value={quizState.education} onChange={(val) => setQuizState(prev => ({ ...prev, education: val }))} />
                    </div>
                    <div className="rating-row">
                        Security: <Rating value={quizState.security} onChange={(val) => setQuizState(prev => ({ ...prev, security: val }))} />
                    </div>
                </div>
            </div>

            <br />

            <div className="col delimiter">
                <div className="row">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoItem label="Start Time">
                            <MobileTimePicker ampm={false} defaultValue={dayjs(startTime)} value={dayjs(startTime)} onChange={e => setStartTime(e?.toDate().getTime()!)} />
                        </DemoItem>

                        <DemoItem label="End Time">
                            <MobileTimePicker ampm={false} defaultValue={dayjs(endTime)} value={dayjs(endTime)} onChange={e => setEndTime(e?.toDate().getTime()!)} />
                        </DemoItem>

                    </LocalizationProvider>
                </div>
                <button onClick={setTimeHandler}>Set</button>
            </div >
            <br />
            <br />
            <br />
            <br />

            <button onClick={restartHandler}>Restart</button>
        </>


    )
}


export default AdminPanel;