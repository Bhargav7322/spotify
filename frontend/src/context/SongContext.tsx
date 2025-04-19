import React, {createContext,ReactNode,useContext ,useEffect,useState} from 'react';


const server = "http://localhost:8000"

export interface Song {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    audio: string;
    album: string;
}

export interface Album {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
}


const SongContext = createContext(undefined)

interface SongProviderProps {
    children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
    const [song, setSong] = useState<Song[]>([]);
    return <SongContext.Provider value={(song)}>{children}</SongContext.Provider>;
}