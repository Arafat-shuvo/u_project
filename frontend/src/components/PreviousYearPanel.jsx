import { useEffect, useMemo, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";
import { BsBookHalf } from "react-icons/bs";
import API from "../api/axios";
import PdfViewer from "./PdfViewer";

export default function PreviousYearPanel() {
  const [files, setFiles] = useState([]);
  const [year, setYear] = useState("");
  const [selectedFileUrl, setSelectedFileUrl] = useState();
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/prev");
        console.log(data);
        setFiles(data || []);
      } catch (err) {
        console.error("Error fetching previous year PDFs:", err);
      }
    })();
  }, []);

  // Filter files by selected year

  const filtered = useMemo(() => {
    if (!year) return files;
    return files.filter((f) =>
      f.filename.toLowerCase().includes(year.toLowerCase())
    );
  }, [files, year]);
  console.log(filtered);
  const handleShowPdf = (url) => {

    console.log(url)
    setSelectedFileUrl(url);
    setShowPdf(true);
  };
console.log(selectedFileUrl)
  return (
    <div className="bg-white container mx-auto rounded-2xl border border-gray-200 p-4">
      {/* Header */}
      <div className="">
        <div className="flex items-center gap-3 mb-4">
          <BsBookHalf className="text-[#2f80ed] text-2xl" />
          <h1 className="text-xl font-bold text-[#2f80ed]">
            Previous Year Papers
          </h1>
        </div>

        {/* Year Dropdown */}
        <div className="flex items-center gap-2 w-64">
          <HiOutlineCalendar className="text-[#2f80ed] text-lg" />
          <select
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm 
                       focus:ring-2 focus:ring-[#2f80ed] outline-none transition 
                       bg-white text-gray-700"
            value={year}
            onChange={(e) => handleShowPdf(e.target.value)}
          >
            <option value="">Choose Year...</option>
            {files?.map((y) => (
              <option key={y._id} value={y.url}>
                {y.filename}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File List */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {filtered?.map((f, index) => (
          <button
            key={f._id}
            onClick={() => handleShowPdf(f.url)}
            style={{ animationDelay: `${index * 0.05}s` }}
            className="flex items-center gap-3 border border-gray-200 rounded-xl 
                       px-4 py-3 bg-gray-50 hover:bg-[#2f80ed]/10 
                       hover:border-[#2f80ed] transition-all duration-300 
                       opacity-0 animate-[fadeInUp_0.4s_forwards]"
          >
            <FaFilePdf className="text-red-500 text-lg" />
            <span className="text-sm font-medium text-gray-700">
              {f.filename} 55
            </span>
          </button>
        ))}
        {!filtered?.length && (
          <div className="text-sm text-gray-500 italic col-span-2 text-center">
            No PDFs available for this year.
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showPdf ? "opacity-100 translate-y-0 " : "opacity-0 -translate-y-5"
        }`}
      >
        {selectedFileUrl && (
          <div className="border-t border-gray-200 pt-4 ">
            <PdfViewer url={selectedFileUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
