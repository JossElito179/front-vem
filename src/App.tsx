import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './auth.modul/Login.components'
import Signup from './auth.modul/Signup.components'
import Dashboard from './dashboard.modul/pages/Dashboard.page'
import AbscenceDemande from './abscence.modul/pages/AbsenceDemande.page'
import AbscenceListes from './abscence.modul/pages/AbscenceList.page'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/abscence/demande" element={<AbscenceDemande />} />
      <Route path="/abscence/list" element={<AbscenceListes />} />
    </Routes>
  )
}

export default App
