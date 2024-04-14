import { useContext } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'

import AdminPanel from './components/adminPanel/adminPanel';
import CandidateList from './components/candidateList/candidateList';
import { AppContext } from './context';
import Results from './components/results/results';

const theme = createTheme();

function App() {
  const { isOwner, currentAccount, connectAccountHandler, timeToEnd } = useContext(AppContext);
  const isEnded = timeToEnd <= 0;

  return (
    <ThemeProvider theme={theme}>
      <main>
        {
          isOwner &&
          <section id="admin-section">
            <AdminPanel />
          </section>
        }

        <section style={{ transform: `translateX(${isOwner ? '10vw' : '0'})` }}>
          <h1>Election project</h1>
          <br />
          {
            currentAccount ? <p>Your account {currentAccount}</p> : <button onClick={connectAccountHandler}>Connect Wallet</button>
          }
          <br />
          {
            isEnded ?
              <Results />
              :
              <CandidateList />

          }
        </section>
      </main>
    </ThemeProvider>
  )
}

export default App
