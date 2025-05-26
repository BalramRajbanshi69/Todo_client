import React from 'react'
import Home from './components/Home'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import "./App.css"
import Toast from './components/Toast'
import TaskProvider from './context/TaskProvider'
import Tasks from './components/Tasks'
const App = () => {
  return (
    <div>
      <Router>
        <TaskProvider>
        <Toast/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path="/alltasks" element={<Tasks/>}/>
        </Routes>
        </TaskProvider>
      </Router>
    </div>
  )
}

export default App


