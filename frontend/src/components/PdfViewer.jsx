export default function PdfViewer({ url }) {
  if (!url) return null;

  console.log(url)
  return (
    <div className="mt-3">
      <iframe title="PDF" className="w-full h-[70vh] border rounded" src={url}></iframe>
    </div>
  );
}
