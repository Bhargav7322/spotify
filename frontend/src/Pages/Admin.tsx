import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const {albums,songs,fetchAlbumSongs,fetchSongs} = useSongData()
 
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);
  return <div className="min-h-screen bg-[#212121] text-white p-8">
    <Link to={"/"}  className="bg-green-500 "           ></Link>
  </div>;
};

export default Admin;
