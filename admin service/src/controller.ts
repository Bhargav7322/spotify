import getBuffer from "./config/dataUri.js";
import TryCatch from "./TryCatch.js";
import { Request } from "express";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
import { redisClinet } from "./index.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not Admin" });
    return;
  }

  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: "Please upload a file" });
    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({ message: "Filed To Generate File Buffer" });
    return;
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "albums",
  });
  const result = await sql`
    INSERT INTO albums (title, description, thumbnail)VALUES (${title}, ${description}, ${cloud.secure_url})RETURNING *`;

  if(redisClinet.isReady){
    await redisClinet.del("albums");
    console.log("Cache invalidated for albums"); 
  }
  res.json({
    message: "Album Created",
    album: result[0],
  });
});

export const addSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not Admin" });
    return;
  }

  const { title, description, album } = req.body;

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;
  if (isAlbum.length === 0) {
    res.status(404).json({ message: "No album with this id" });
    return;
  }

  const file = req.file;

  if (!file) {
    res.status(400).json({ message: "Please upload a file" });
    return;
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({ message: "Filed To Generate File Buffer" });
    return;
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "songs",
    resource_type: "video",
  });
  const result = await sql`
INSERT INTO songs (title, description, audio, album_id)VALUES (${title}, ${description}, ${cloud.secure_url},${album})RETURNING *
`;
   
if(redisClinet.isReady){
  await redisClinet.del("songs");
  console.log("Cache invalidated for songs"); 
}

  res.json({
    message: "Song Added",
  });
});

export const addThumbnail = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not Admin" });
    return;
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

  if (song.length === 0) {
    res.status(404).json({ message: "No song with this id" });
    return;
  }

  const file = req.file;

  if (!file) {
    res.status(400).json({ message: "Please upload a file" });
    return;
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({ message: "Filed To Generate File Buffer" });
    return;
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);
  console.log("cloud",cloud)
  const result =
    await sql`UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *`;

    if(redisClinet.isReady){
      await redisClinet.del("songs");
      console.log("Cache invalidated for songs"); 
    }
console.log("resukt",result)

  res.json({
    message: "Thumbnail Added",
    song: result[0],
  });
});

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not Admin" });
    return;
  }

  const { id } = req.params;
  console.log("ddd",id)

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;
  if (isAlbum.length === 0) {
    res.status(404).json({ message: "No album with this id" });
    return;
  }

  await sql`DELETE FROM songs WHERE album_id = ${id}`;
  await sql`DELETE FROM albums WHERE id = ${id}`;

  if(redisClinet.isReady){
    await redisClinet.del("albums");
    console.log("Cache invalidated for albums"); 
  }

  if(redisClinet.isReady){
    await redisClinet.del("songs");
    console.log("Cache invalidated for songs"); 
  }

  res.json({
    message: "Album Deleted Successfully",
  });
});


export const deleteSong = TryCatch(async (req: AuthenticatedRequest, res) => {

  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not Admin" });
    return;
  }

  const { id } = req.params;

  await sql`DELETE FROM songs WHERE id = ${id}`;
  res.json({
    message:"Song Deleted Successfully",
  })

})