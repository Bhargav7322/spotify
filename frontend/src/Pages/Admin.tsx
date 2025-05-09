/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Response } from 'express';
import { Response } from 'express';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { albums, songs, fetchAlbumSongs, fetchSongs ,fetchAlbums} = useSongData();
  const [title,setTitle] = useState<string>("")
  const [description,setDescription] = useState<string>("")
  const [album,setAlbum] = useState<string>("")
  const [file,setFile] =  useState<file  | null>(null)
  const [btnLoading,setBtnLoading]= useState<boolean>(false)
  const server = "http://localhost:7000"

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>)=>{
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const addAlbumHandler = async(e:FormEvent) =>{
    e.preventDefault()
      if(!file) return

    const formData = new FormData()
    formData.append("title",title)
    formData.append("description",description)
    formData.append("file",file)
setBtnLoading(true)

try {
  const {data} = await axios.post(`${server}/api/v1/album/new`,formData,{
    headers:{
      token:localStorage.getItem("token")
    }
  })
  toast.success(data.message)
  fetchAlbums()
  setBtnLoading(false)
  setDescription("")
  setFile("")
  setTitle("")
} catch (error:any) {
  toast.error(error.response?.data?.message || "An Error Occured") 
  setBtnLoading(false)
}
  }


  const addSongHandler = async(e:FormEvent) =>{
    e.preventDefault()
      if(!file) return

    const formData = new FormData()
    formData.append("title",title)
    formData.append("description",description)
    formData.append("file",file)
    formData.append("album",album)
setBtnLoading(true)

try {
  const {data} = await axios.post(`${server}/api/v1/song/new`,formData,{
    headers:{
      token:localStorage.getItem("token")
    }
  })
  toast.success(data.message)
  fetchSongs()
  setBtnLoading(false)
  setDescription("")
  setFile("")
  setTitle("")
  setAlbum("")
} catch (error:any) {
  toast.error(error.response?.data?.message || "An Error Occured") 
  setBtnLoading(false)
}
  }

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen bg-[#212121] text-white p-8">
      <Link
        to={"/"}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Go to Home page
      </Link>
      <h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2>
      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4" onSubmit={addAlbumHandler}>
        <input type="text" placeholder="title" className="auth-input" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <input type="text" placeholder="description" className="auth-input" value={description} onChange={(e)=>setDescription(e.target.value)} required />
        <input type="file" placeholder="choose Thumnnail" onChange={fileChangeHandler} required className="auth-input" accept="image/*"/>
        <button className="auth-btn" style={{width:"100px"}} disabled={btnLoading}>{btnLoading? "Please Wait..." : "Add"}</button>
      </form> 
    </div>
  );
};

export default Admin;
