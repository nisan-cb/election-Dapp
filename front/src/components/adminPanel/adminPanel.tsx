import { useContext, useState } from "react";
import { AppContext } from "../../context";

const AdminPanel = () => {
    const { electionContract, currentAccount } = useContext(AppContext);

    const [newCandidateName, setNewCandidateName] = useState('');

    const addCandidateHandler = async () => {
        if (!electionContract) return

        const res = await electionContract.methods.addCandidate(newCandidateName).send({ from: currentAccount });
        setNewCandidateName('');
        console.log(res)

    }

    return (
        <>
            <h1>Admin Panel</h1>

            <input type="text" placeholder="Candidate name" value={newCandidateName} onChange={e => setNewCandidateName(e.target.value)} />
            <button onClick={addCandidateHandler}>Add</button>
        </>


    )
}


export default AdminPanel;