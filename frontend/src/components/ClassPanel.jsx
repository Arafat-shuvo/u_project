import { useEffect, useState } from "react";
import { BsPlayCircle, BsInfoCircle } from "react-icons/bs";
import { HiOutlineCollection } from "react-icons/hi";
import API from "../api/axios";

export default function ClassPanel() {
  const [list, setList] = useState([]);
  const [active, setActive] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState("auto");

  // Function to convert YouTube URL to embed format
  const convertToEmbedUrl = (url) => {
    if (!url) return "";

    // Handle youtu.be short URLs
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle regular YouTube URLs
    if (url.includes("youtube.com")) {
      const videoId = url.match(/v=([^&]+)/)?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    return "";
  };

  // Set consistent height for the container
  useEffect(() => {
    const calculateHeight = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint and above
        setContainerHeight("500px");
      } else {
        setContainerHeight("auto");
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  // Mock data fetch
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const {data} = await API.get("/year");
        console.log("Fetched data:", data)
        
        setList(data);
        if (data.length) setActive(data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleClick = (item) => {
    setShowVideo(false);
    setTimeout(() => {
      setActive(item);
      setShowVideo(true);
    }, 200);
  };

  return (
    <div className="container mx-auto bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <HiOutlineCollection className="text-[#2f80ed] text-2xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2f80ed]">
            Class Lectures (YouTube)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a class to start watching
          </p>
        </div>
      </div>

      <div
        className="grid md:grid-cols-2 gap-8 overflow-hidden"
        style={{ height: containerHeight }}
      >
        <div className="space-y-3 overflow-y-auto pr-2">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 animate-pulse"
              >
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No classes available
            </div>
          ) : (
            list?.map((item) => (
              <button
                key={item._id}
                onClick={() => handleClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 group relative overflow-hidden ${
                  active?._id === item?._id
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-700 font-semibold shadow-sm"
                    : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                {active?._id === item._id && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
                )}

                <BsPlayCircle
                  className={`text-lg flex-shrink-0 ${
                    active?._id === item._id
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-blue-400"
                  }`}
                />
                <span className="truncate text-left">{item?.year}</span>

                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex flex-col h-full">
          <div
            className={`mb-2 flex items-center justify-between ${
              showVideo ? "opacity-100" : "opacity-70"
            }`}
          >
            <h3 className="font-medium text-gray-700">
              {showVideo ? "Now Playing" : "Video Preview"}
            </h3>
            {!showVideo && (
              <div className="flex items-center text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                <BsInfoCircle className="mr-1" />
                Select a class to play
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0">
            {" "}
            <div
              className={`relative border-2 h-full ${
                showVideo
                  ? "border-blue-300 shadow-md"
                  : "border-dashed border-blue-200 bg-gradient-to-br from-blue-50/30 to-gray-50/50"
              } rounded-xl overflow-hidden transition-all duration-500 ease-out ${
                showVideo
                  ? "opacity-100 translate-y-0"
                  : "opacity-90 translate-y-0"
              }`}
            >
              {showVideo && active?.youtubeLink ? (
                <div className="w-full h-full">
                  <iframe
                    className="w-full h-full"
                    src={convertToEmbedUrl(active?.youtubeLink)}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <BsPlayCircle className="text-3xl text-blue-400" />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-700 mb-1">
                    Video Preview
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Select a class from the list to display the video here. The
                    video will play in this dedicated area.
                  </p>

                  {/* Decorative elements */}
                  <div className="absolute bottom-3 left-3 w-10 h-2 bg-blue-200 rounded-full opacity-50"></div>
                  <div className="absolute top-3 right-3 w-8 h-8 border-2 border-blue-200 rounded-full opacity-30"></div>
                  <div className="absolute top-1/2 left-1/4 w-12 h-1 bg-blue-100 rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          {/* Video information when active */}
          {showVideo && active && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 truncate">
                {active?.year} - Class Video
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Click the fullscreen icon for better viewing experience
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
