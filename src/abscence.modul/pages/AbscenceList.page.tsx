import AbscenceListComponent from "../components/AbscenceList.component"
import InsideSidebar from "../../templates.component/InsideSidebar.component"

const AbscenceListes = () => {
    return (
      <InsideSidebar>
        <div className="flex">
          <AbscenceListComponent />
        </div>
      </InsideSidebar>
    )
}

export default AbscenceListes