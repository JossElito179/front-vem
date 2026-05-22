import AbsenceForm from "../components/AbscenceForm.component"
import InsideSidebar from "../../templates.component/InsideSidebar.component"

const AbscenceDemande = () => {
  return (
    <InsideSidebar>
      <div className="flex">
        <AbsenceForm />
      </div>
    </InsideSidebar>
  )
}

export default AbscenceDemande