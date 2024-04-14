import { useContext } from "react";
import { AppContext } from "../../context";
import Spinner from "../loader/spinner";
import './style.css'


const Results = () => {
    const { candidates, isLoading } = useContext(AppContext);


    const displayList = () => {
        if (candidates.length === 0)
            return <p>There are no candidates</p>
        return candidates.sort((a, b) => b.voteCount - a.voteCount).map(({ name, id, voteCount }) => <div key={id} className="tr">
            <div className="td">{id}</div>
            <div className="td">{name}</div>
            <div className="td">{voteCount}</div>

        </div>)
    }

    return (
        <>
            <>Results</>
            <div id="candidatesTable" className="result-table">
                <div id='tableHeader' className="th">
                    <div className="td">#</div>
                    <div className="td">name</div>
                    <div className="td">votes</div>
                </div>
                {isLoading ?

                    < Spinner />
                    :
                    <>
                        {displayList()}
                    </>
                }
            </div>
        </>
    )
}

export default Results;
