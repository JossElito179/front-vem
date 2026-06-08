import InsideSidebar from "../../templates.component/InsideSidebar.component";
import { CiSettings } from "react-icons/ci";

const SettingComponent = () => {
  return (
      <InsideSidebar>
        <div className="flex  w-full h-auto text-black dark:text-white">
            {/* header */}
            <div className="flex items-center gap-2">
                <CiSettings size={30} />
                <strong>Prametrages</strong>
            </div>
        </div>
      </InsideSidebar>
  );
};

export default SettingComponent;
