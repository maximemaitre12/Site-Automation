import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Jobs DB
  getJobs: () => ipcRenderer.invoke('db:getJobs'),
  createJob: (job: unknown) => ipcRenderer.invoke('db:createJob', job),
  updateJob: (id: number, job: unknown) => ipcRenderer.invoke('db:updateJob', id, job),
  deleteJob: (id: number) => ipcRenderer.invoke('db:deleteJob', id),

  // Candidates DB
  getCandidates: (jobId?: number) => ipcRenderer.invoke('db:getCandidates', jobId),
  updateCandidateStatus: (id: number, status: string) => ipcRenderer.invoke('db:updateCandidateStatus', id, status),

  // Messages DB
  getMessages: (jobId?: number) => ipcRenderer.invoke('db:getMessages', jobId),
  createMessage: (msg: unknown) => ipcRenderer.invoke('db:createMessage', msg),
  updateMessage: (id: number, msg: unknown) => ipcRenderer.invoke('db:updateMessage', id, msg),
  deleteMessage: (id: number) => ipcRenderer.invoke('db:deleteMessage', id),

  // Settings DB
  getSetting: (key: string) => ipcRenderer.invoke('db:getSetting', key),
  setSetting: (key: string, value: string) => ipcRenderer.invoke('db:setSetting', key, value),

  // Scraping
  searchCandidates: (params: unknown) => ipcRenderer.invoke('scraper:search', params),

  // AI
  generateJobDescription: (title: string) => ipcRenderer.invoke('ai:generateJob', title),
  generateMessage: (job: unknown, candidateRole: string, platform: string, language: string) =>
    ipcRenderer.invoke('ai:generateMessage', job, candidateRole, platform, language),

  // Analytics
  logEvent: (type: string, metadata: unknown) => ipcRenderer.invoke('analytics:log', type, metadata),
  getKPIs: () => ipcRenderer.invoke('analytics:getKPIs'),
  getWeeklyActivity: () => ipcRenderer.invoke('analytics:getWeekly'),
  getRecentEvents: () => ipcRenderer.invoke('analytics:getRecent'),

  // System
  openExternal: (url: string) => ipcRenderer.invoke('system:openExternal', url),
})
