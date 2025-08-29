import { useState } from "react";
import API from "../api/axios";
import {
  FaCloudUploadAlt,
  FaYoutube,
  FaFilePdf,
  FaCalendarAlt,
  FaLink,
  FaSave,
  FaPlusCircle,
  FaCog,
} from "react-icons/fa";

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [askPdf, setAskPdf] = useState(null);
  const [fname, setFname] = useState(null);

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose a file");
    const fd = new FormData();
    fd.append("pdf", file);
    try {
      await API.post("/pdf/upload", fd);
      alert("Uploaded to Cloudinary + saved!");
      setFile(null);
    } catch (err) {
      alert("Upload failed");
    }
  };

  const addYear = async (e) => {
    e.preventDefault();
    if (!year || !youtubeLink) return alert("Provide year & link");
    try {
      await API.post("/year", { year: year, youtubeLink });
      alert("Year saved!");
      setYear("");
      setYoutubeLink("");
    } catch {
      alert("Failed to save year");
    }
  };

  const uploadAskPdf = async (e) => {
    e.preventDefault();
    if (!askPdf) return alert("Choose a PDF");
    if (!fname) return alert("Choose a PDF");
    const fd = new FormData();
    fd.append("prev", askPdf);
    fd.append("name", fname);
    try {
      await API.post("/prev", fd);
      alert("Ask-PDF uploaded & indexed!");
      setAskPdf(null);
    } catch {
      alert("Ask-PDF upload failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <FaCog className="text-[#2f80ed]" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage your study portal content</p>
      </div>

      {/* Upload PDF/Image Section */}
      <section className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaCloudUploadAlt className="text-xl text-[#2f80ed]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Upload Study Material
          </h2>
        </div>

        <form onSubmit={uploadFile} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#2f80ed] transition-colors">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <FaCloudUploadAlt className="text-2xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  {file ? file.name : "Click to select PDF or image file"}
                </p>
              </div>
            </label>

            <button
              type="submit"
              disabled={!file}
              className="px-5 py-2.5 rounded-lg bg-[#2f80ed] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#2d70d0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaCloudUploadAlt />
              Upload File
            </button>
          </div>
        </form>
      </section>

      {/* Add Year + YouTube Link Section */}
      <section className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaYoutube className="text-xl text-[#2f80ed]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Add Class Content
          </h2>
        </div>

        <form onSubmit={addYear} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-[#2f80ed]" />
                Academic Year
              </label>
              <input
                type="number"
                placeholder="e.g., 2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2f80ed]"
                min="2000"
                max="2100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaLink className="text-[#2f80ed]" />
                YouTube Embed Link
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2f80ed]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!year || !youtubeLink}
            className="px-5 py-2.5 rounded-lg bg-[#2f80ed] text-white font-medium flex items-center gap-2 hover:bg-[#2d70d0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaSave />
            Save Class
          </button>
        </form>
      </section>

      {/* Ask-PDF Upload Section */}
      <section className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaFilePdf className="text-xl text-[#2f80ed]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Previous Question
          </h2>
        </div>

        <form onSubmit={uploadAskPdf} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label>Year/Name</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setFname(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2f80ed] "
              id="pdf-upload"
            />
            <label className="flex-1 cursor-pointer">
              <div className="border border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#2f80ed] transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setAskPdf(e.target.files?.[0] || null)}
                  className="hidden"
                  id="pdf-upload"
                />
                <FaFilePdf className="text-2xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  {askPdf ? askPdf.name : "Click to select PDF for Q&A system"}
                </p>
              </div>
            </label>

            <button
              type="submit"
              disabled={!askPdf}
              className="px-5 py-2.5 rounded-lg bg-[#2f80ed] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#2d70d0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaPlusCircle />
              Upload & Index
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
