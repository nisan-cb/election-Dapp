import { useContext, useEffect, useState } from "react";
import Spinner from "../loader/spinner";
import { AppContext } from "../../context";
import './candidateList.css'

import Timer from "../timer/timer";
import Rating from "../rating/rating";

const CandidateList = () => {
    const { candidates, electionContract, currentAccount, isCurrentUserHasVoted, isOpen } = useContext(AppContext);
    const [selectedCandidate, setSelectedCandidate] = useState<number>();
    const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
    const [quizState, setQuizState] = useState({ economy: 0, education: 0, security: 0 })
    const [isShowResult, setIsShowResult] = useState(false);
    const [compatibleCandidateId, setCompatibleCandidateId] = useState<number | null>(null)



    useEffect(() => {
        if (candidates.length === 0) return;
        setSelectedCandidate(candidates[0].id)
    }, [candidates]);

    const displayList = () => {
        return candidates.map(({ name, id, voteCount, ideology }) => <div key={id} className="tr">
            <div className="td">{id}</div>
            <div className="td">{name}</div>
            <div className="td">{voteCount}</div>
            <div className="tooltip">
                <div className="rating-row">Economy : <Rating value={ideology.economy} /></div>
                <div className="rating-row">Education : <Rating value={ideology.education} /></div>
                <div className="rating-row">Security : <Rating value={ideology.security} /></div>
            </div>
        </div>)
    }

    const displaySelection = () => {
        return candidates.map(({ name, id }) => <option key={`option-${id}`} value={id} className="tr">{name}</option>)
    }

    const voteHandler = async () => {
        if (!electionContract || !selectedCandidate) return
        const res = await electionContract.methods.vote(selectedCandidate).send({ from: currentAccount });
        console.log(res)
    }

    const voteByIdeologyHandler = async () => {
        if (!electionContract || !selectedCandidate) return
        const res = await electionContract.methods.voteByIdeology(quizState).send({ from: currentAccount });
        console.log("Returned Candidate ID:", Number(res?.events?.NewVote.returnValues.candidateID));
        setIsShowResult(true);
        setCompatibleCandidateId(Number(res?.events?.NewVote.returnValues.candidateID))
    }

    return (
        <>
            <div id="candidatesTable">
                <div id='tableHeader' className="th">
                    <div className="td">#</div>
                    <div className="td">name</div>
                    <div className="td">votes</div>
                </div>
                {candidates.length === 0 ?

                    < Spinner />
                    :
                    <>
                        {displayList()}
                    </>
                }
            </div>
            {
                isCurrentUserHasVoted ?
                    <p>Already voted</p>
                    :
                    isOpen &&
                    <>
                        <div id="select-wrapper">
                            <select value={selectedCandidate} onChange={e => {
                                setSelectedCandidate(Number(e.target.value))
                            }}>
                                {displaySelection()}
                            </select>
                            <button onClick={voteHandler}>Vote</button>

                        </div>
                        <br />
                        <button onClick={() => setIsQuizOpen(prev => !prev)}>Vote by ideology</button>
                        <br />
                        <br />
                        {isQuizOpen &&
                            (isShowResult ?
                                <>The best match is candidate number {compatibleCandidateId} {candidates[compatibleCandidateId! - 1]?.name}</>
                                :
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
                                    <button onClick={voteByIdeologyHandler}>Vote</button>

                                </div>)
                        }
                    </>


            }
            <Timer />
        </>
    )
}

export default CandidateList;
