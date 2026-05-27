import { useRoutes } from 'react-router-dom'
import './App.css'
import routes from './routes'
import RouteLoader from './components/RouteLoader'

function App() {
  const element = useRoutes(routes)
  return (
    <>
      <RouteLoader />
      {element}
    </>
  )
}

export default App
