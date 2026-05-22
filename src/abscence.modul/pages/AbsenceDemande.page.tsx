import { useState } from "react"
import AbsenceForm from "../components/AbscenceForm.component"
import InsideSidebar from "../../templates.component/InsideSidebar.component"

const AbscenceDemande = () => {
  const [isFormOpen, setIsFormOpen] = useState(true)

  return (
    <InsideSidebar>
      <AbsenceForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </InsideSidebar>
  )
}

export default AbscenceDemande