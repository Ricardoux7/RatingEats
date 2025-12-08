import UploadImage from "./UploadImage.jsx";

const UploadPost = ({ restaurantId }) => {
  return(
    <div>
      <UploadImage restaurantId={restaurantId} mode="postUpload" />
    </div>
  )
}

export default UploadPost;