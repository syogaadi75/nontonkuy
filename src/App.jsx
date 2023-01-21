import React, { useEffect } from 'react'
import Login from './pages/Login'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ListRooms from './pages/ListRooms';
import Watch from './pages/Watch';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<ListRooms />} />
          <Route path='/login' element={<Login />} />
          <Route path='/main' element={<ListRooms />} />
          <Route path='/watch/:roomId' element={<Watch />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App