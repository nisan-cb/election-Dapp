import { useContext } from 'react'
import './App.css'

import AdminPanel from './components/adminPanel/adminPanel';
import CandidateList from './components/candidateList/candidateList';
import { AppContext } from './context';


function App() {
  const { isOwner, currentAccount, connectAccountHandler } = useContext(AppContext);

  return (
    <>
      <h1>Election project</h1>
      {
        currentAccount ? <p>Your account {currentAccount}</p> : <button onClick={connectAccountHandler}>Connect Wallet</button>
      }
      <CandidateList />
      {isOwner && <AdminPanel />}
    </>
  )
}

export default App
