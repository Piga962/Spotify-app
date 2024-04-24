import {Routes, Route} from 'react-router-dom';
import './App.css'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App;