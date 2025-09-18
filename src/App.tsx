

import { OpportunitiesProvider } from './context/OpportunitiesContext';
import LeadsPage from './pages/LeadsPage';


export default function App() {
  return (
    <OpportunitiesProvider>
      <LeadsPage />
    </OpportunitiesProvider>
  )
}