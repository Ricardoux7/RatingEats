import UploadImage from "./UploadImage.jsx";

const UploadPost = ({ restaurantId }) => {
  return(
    <div className="mt-10 md:mt-0">
      <UploadImage restaurantId={restaurantId} mode="postUpload" />
    </div>
  )
}

export default UploadPost;