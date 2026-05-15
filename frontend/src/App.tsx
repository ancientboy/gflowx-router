import { Route, Routes } from 'react-router-dom'
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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="keys" element={<Keys />} />
      </Route>
    </Routes>
  )
}
