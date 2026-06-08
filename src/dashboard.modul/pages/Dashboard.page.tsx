import InsideSidebar from "../../templates.component/InsideSidebar.component"
import DashboardComponent from "../components/Dashboard.component"

const Dashboard = () => { 
    return (
      <InsideSidebar>
        <div className="w-full">
          <DashboardComponent />
        </div>
      </InsideSidebar>
    )
}

export default Dashboard