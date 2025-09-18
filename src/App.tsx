

import BackToTop from '@components/BackToTop';

import { OpportunitiesProvider } from './context/OpportunitiesContext';
import LeadsPage from './pages/LeadsPage';


export default function App() {
  return (
    <OpportunitiesProvider>
      <LeadsPage />
      <BackToTop />
    </OpportunitiesProvider>
  )
}