import { useContext, useEffect, useState } from "react";
import Spinner from "../loader/spinner";
import { AppContext } from "../../context";
import './candidateList.css'

const CandidateList = () => {
    const { candidates, electionContract, currentAccount, isCurrentUserHasVoted } = useContext(AppContext);
    const [selectedCandidate, setSelectedCandidate] = useState<number>();


    useEffect(() => {
        if (candidates.length === 0) return;
        setSelectedCandidate(candidates[0].id)
    }, [candidates]);

    const displayList = () => {
        return candidates.map(({ name, id, voteCount }) => <div key={id} className="tr">
            <div className="td">{id}</div>
            <div className="td">{name}</div>
            <div className="td">{voteCount}</div>
        </div>)
    }

    const displaySelection = () => {
        return candidates.map(({ name, id }) => <option key={id} value={id} className="tr">{name}</option>)
    }

    const voteHandler = async () => {
        if (!electionContract || !selectedCandidate) return
        const res = await electionContract.methods.vote(selectedCandidate).send({ from: currentAccount });
        console.log(res)
    }

    return (
        <>
            <div id="candidatesTable">
                <div id='tableHeader' className="tr">
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
                    <div id="select-wrapper">
                        <select value={selectedCandidate} onChange={e => setSelectedCandidate(Number(e.target.value))}>
                            {displaySelection()}
                        </select>
                        <button onClick={voteHandler}>Vote</button>
                    </div>
            }
        </>
    )
}

export default CandidateList;
