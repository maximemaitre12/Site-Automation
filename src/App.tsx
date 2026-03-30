import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { Dashboard } from './pages/Dashboard'
import { JobDescriptions } from './pages/JobDescriptions'
import { Interviews } from './pages/Interviews'
import { Messages } from './pages/Messages'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const { currentPage } = useAppStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main className="main-content">
          <div style={{ display: currentPage === 'dashboard'  ? 'contents' : 'none' }}><Dashboard /></div>
          <div style={{ display: currentPage === 'jobs'       ? 'contents' : 'none' }}><JobDescriptions /></div>
          <div style={{ display: currentPage === 'interviews' ? 'contents' : 'none' }}><Interviews /></div>
          <div style={{ display: currentPage === 'messages'   ? 'contents' : 'none' }}><Messages /></div>
          <div style={{ display: currentPage === 'analytics'  ? 'contents' : 'none' }}><Analytics /></div>
          <div style={{ display: currentPage === 'settings'   ? 'contents' : 'none' }}><Settings /></div>
        </main>
      </div>
    </div>
  )
}
