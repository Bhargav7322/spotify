import getBuffer from "./config/dataUri.js";
import TryCatch from "./TryCatch.js";
import { Request } from "express";
import cloudinary  from 'cloudinary';
import { sql } from "./config/db.js";

interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        role: string;
    }
}

export const addAlbum = TryCatch(async (req:AuthenticatedRequest, res) => {
    if(req.user?.role !== "admin") {
        res.status(403).json({message:"You are not Admin"})
        return
    }

    const { title, description } = req.body;

    const file = req.file;

    if(!file){
        res.status(400).json({message:"Please upload a file"})
        return
    }

    const fileBuffer =  getBuffer(file)

    if(!fileBuffer  || !fileBuffer.content){
        res.status(500).json({message:"Filed To Generate File Buffer"})
        return
    }

    const cloud =  await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "albums",
    })
    const result = await sql`
    INSERT INTO albums (title, description, thumbnail)
    VALUES (${title}, ${description}, ${cloud.secure_url})
    RETURNING *
    `
    
} )