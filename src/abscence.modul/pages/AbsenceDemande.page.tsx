
import AbsenceForm from "../components/AbscenceForm.component"
import Sidebar from "../../templates.component/Sidebar.component"
import Header from "../../templates.component/Headers.component"


const AbscenceDemande = () => {
  return (
    <div className="">
      <Sidebar id='absence' />
      <Header />
      <main className="ml-64 pt-20 text-start!">
        <div className="">
          <div className="flex">
            <AbsenceForm />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AbscenceDemande