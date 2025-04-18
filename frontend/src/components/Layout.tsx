import Sidebar from "./Sidebar"

const Layout = () => {
  return     <div className="h-screen">
    <div className="h-[90%] flex">
        <Sidebar/>
        <div className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] "></div>
    </div>
  </div>
}

export default Layout