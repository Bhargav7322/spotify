import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useSongData } from "../context/SongContext";
import { useEffect } from "react";
import Loading from "../components/Loading";

const Album = () => {
  const {
    fetchAlbumSongs,
    albumSong,
    albumData,
    setIsPlying,
    setSelectedSong,
    loading,
  } = useSongData();

  const params = useParams<{ id: string }>();
  useEffect(() => {
    if (params.id) {
      fetchAlbumSongs(params.id);
    }
  }, [params.id]);

  return (
    <div>
      <Layout>
        {albumData && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
                  {albumData.thumbnail && (
                    <img
                      src={albumData.thumbnail}
                      className="w-48 rounded"
                      alt=""
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </Layout>
    </div>
  );
};

export default Album;
