import { useState } from "react";
import { NotiSidebar } from "./notiSideBar";

interface props {
  title: string;
}

export function PageHeading({ title }: props) {
  const [openNoti, setOpenNoti] = useState(false);

  return (
    <>
      {openNoti && (
        <NotiSidebar open={openNoti} onClose={() => setOpenNoti(false)} />
      )}
      <div className="flex justify-between items-center px-12 py-4 bg-white border-b border-gray-200 rounded-xl">
        <h3 className="text-3xl font-600">{title}</h3>

        {/* user & notification*/}
        <div className="flex items-center justify-center">
          <div
            onClick={() => setOpenNoti(true)}
            className="w-12 h-12 flex items-center justify-center mr-6"
          >
            <i className="mdi mdi-bell-outline text-2xl text-blue-500"></i>
          </div>

          <div className="w-12 h-12 bg-blue-400 flex items-center justify-center rounded-full">
            <i className="mdi mdi-account-outline text-2xl text-white"></i>
          </div>
        </div>
      </div>
    </>
  );
}
