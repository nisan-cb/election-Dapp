import { useContext } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'

import AdminPanel from './components/adminPanel/adminPanel';
import CandidateList from './components/candidateList/candidateList';
import { AppContext } from './context';
import Timer from './components/timer/timer';

const theme = createTheme();

function App() {
  const { isOwner, currentAccount, connectAccountHandler } = useContext(AppContext);

  return (
    <ThemeProvider theme={theme}>
      <Timer />
      <h1>Election project</h1>
      {
        currentAccount ? <p>Your account {currentAccount}</p> : <button onClick={connectAccountHandler}>Connect Wallet</button>
      }
      <CandidateList />
      {isOwner && <AdminPanel />}
    </ThemeProvider>
  )
}

export default App
