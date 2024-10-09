import React , {useState, useEffects} from 'react';

const Home = () => {
    
    const [videos, setvideo] = useState([])
    const [loading, setloading] = useState(true)
    const [Error, setError] = useState(null)

    useEffects(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/users/')

                if(!response.ok) {
                    throw new Error("error in response")
                }

                const data = response.json()
                setvideo(data);
                setloading(false)


            } catch (error) {
                    setError(error.message)
                    setloading(false)
            }
            fetchVideos()
        }
    },[])

    return (
        <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">YouTube Clone</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-4">Trending Videos</h2>

        {loading && <p>Loading videos...</p>}
        {Error && <p>Error: {Error}</p>}

        {!loading && !Error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="bg-white shadow rounded-lg overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{video.title}</h3>
                  <p className="text-gray-500">{video.views} views</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;



