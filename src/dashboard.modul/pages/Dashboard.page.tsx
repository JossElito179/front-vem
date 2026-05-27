import InsideSidebar from "../../templates.component/InsideSidebar.component"
import DashboardComponent from "../components/Dashboard.component"

const Dashboard = () => { 
    return (
      <InsideSidebar>
        <div className="flex">
          <DashboardComponent />
        </div>
      </InsideSidebar>
    )
}

export default Dashboard