import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import { ConsoleLayout } from './layouts/ConsoleLayout'
import { MarketingLayout } from './layouts/MarketingLayout'
import Dashboard from './pages/Dashboard'
import Keys from './pages/Keys'
import Login from './pages/Login'
import { MarketingHome } from './pages/MarketingHome'

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route index element={<MarketingHome />} />
      </Route>
      <Route element={<ConsoleLayout />}>
        <Route path="login" element={<Login />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="keys"
          element={
            <ProtectedRoute>
              <Keys />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
