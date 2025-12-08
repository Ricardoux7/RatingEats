import UploadImage from "./UploadImage.jsx";

const UpdateBanner = ({ restaurantId, onClose }) => {
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#258A00] p-6 max-w-md w-full flex flex-col items-center gap-4">
        <UploadImage restaurantId={restaurantId} mode="bannerUpload" onClose={onClose} />
      </div>
    </div>
  );
}

export default UpdateBanner;