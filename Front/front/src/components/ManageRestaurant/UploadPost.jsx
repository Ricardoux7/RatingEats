import api from "../../api/api";
import { useState, useEffect } from "react";
import UploadImage from "./UploadImage.jsx";
import Zoom from 'react-medium-image-zoom';

const UploadPost = ({ restaurantId }) => {
  return(
    <div>
      <UploadImage restaurantId={restaurantId} mode="postUpload" />
    </div>
  )
}

export default UploadPost;