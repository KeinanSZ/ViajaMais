import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import ProtectedRoute from './routes/ProtectedRoute'
import Desejos from './pages/Desejos'
import Destinos from './pages/Destinos'
import Login from './pages/Login'
import NaoEncontrada from './pages/NaoEncontrada'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Destinos />} />
          <Route path="desejos" element={<Desejos />} />
        </Route>
      </Route>
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
  )
}

export default App
