import Header from "../../templates.component/Headers.component"
import Sidebar from "../../templates.component/Sidebar.component"
import DashboardComponent from "../components/Dashboard.component"
import Layout from "./Layout"

const Dashboard = () => { 
    return (
    <div className="">
      <Sidebar id='dashboard' />
      <Header />
      <main className="ml-64 pt-20 text-start!">
        <div className="">
          <div className="flex">
            <DashboardComponent />
          </div>
        </div>
      </main>
    </div>
    )
}

export default Dashboard