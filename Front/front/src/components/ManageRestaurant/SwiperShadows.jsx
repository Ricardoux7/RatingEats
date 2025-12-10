import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import ReactShadow from 'react-shadow/emotion';

const SwiperShadow = ({ children, ...props }) => (
  <ReactShadow.div>
    <Swiper {...props} modules={[Pagination]} pagination={{ clickable: true }}>
      {children}
    </Swiper>
  </ReactShadow.div>
);

export { SwiperSlide };
export default SwiperShadow;