import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FileTable from "../components/FileTable";
import axios from "axios";

const DepartmentDashboard = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [refreshSidebar, setRefreshSidebar] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string>("");

  const API = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserInfo(user);
  }, []);

  // Optional: fetch the category name when one is selected
  useEffect(() => {
    const fetchCategoryName = async () => {
      if (!activeCategoryId) {
        setActiveCategoryName("");
        return;
      }

      try {
        const res = await axios.get(`${API}/categories`);
        const match = res.data.find((cat: any) => cat._id === activeCategoryId);
        setActiveCategoryName(match?.name || "");
      } catch (err) {
        console.error("Error fetching category name:", err);
      }
    };

    fetchCategoryName();
  }, [activeCategoryId]);

  return (
    <div className="flex h-screen">
      <Sidebar
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
        refreshTrigger={refreshSidebar}
        userInfo={userInfo}
        onTriggerRefresh={() => setRefreshSidebar((prev) => prev + 1)}
      />

      <div className="flex flex-col flex-grow p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            {userInfo?.department
              ? `${userInfo.department} Department Dashboard`
              : "Department Dashboard"}
          </h1>
        </div>

        {activeCategoryId ? (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {activeCategoryName
                ? `Files in: ${activeCategoryName}`
                : "Loading category..."}
            </h2>
            <FileTable categoryId={activeCategoryId} />
          </>
        ) : (
          <p className="text-gray-500">
            Select a category from the sidebar to view files.
          </p>
        )}
      </div>
    </div>
  );
};

export default DepartmentDashboard;
