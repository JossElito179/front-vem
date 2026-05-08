import AbscenceListComponent from "../components/AbscenceList.component"
import Header from "../../templates.component/Headers.component"
import Sidebar from "../../templates.component/Sidebar.component"


const AbscenceListes = () => {
    return (
    <div className="">
      <Sidebar id='absence' />
      <Header />
      <main className="ml-64 pt-20 text-start!">
        <div className="">
          <div className="flex">
            <AbscenceListComponent />
          </div>
        </div>
      </main>
    </div>
    )
}

export default AbscenceListes