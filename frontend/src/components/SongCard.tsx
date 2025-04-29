import { FaBookmark, FaPlay } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {

  const {addToPlaylist,isAuth} = useUserData()

  const {setSelectedSong,setIsPlaying} = useSongData()

  const saveToPlaylist = () => {
    addToPlaylist(id)
  }

  return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
      <div className="relative group">
        <img src={image ? image : "/dummy.png"} alt={name} className="mr-1 w-[160px] rounded" />
        <div className="flex gap-2">
          {/* <button className="absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:backdrop-opacity-100 transition-opacity duration-300"><FaPlay/></button>
                <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:backdrop-opacity-100 transition-opacity duration-300"><FaBookmark/></button> */}
          <button className="absolute bottom-2 right-14  bg-green-500  text-black p-3  rounded-full group-hover:backdrop-opacity-100 transition-opacity duration-300" onClick={() => {
            setSelectedSong(id)
            setIsPlaying(true)}}>
            <FaPlay />
          </button>
         { <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full  group-hover:backdrop-opacity-100 transition-opacity duration-300" onClick={saveToPlaylist}>
            <FaBookmark />
          </button>}
        </div>
      </div>
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm ">{desc.slice(0, 20)}...</p>
    </div>
  );
};

export default SongCard;
