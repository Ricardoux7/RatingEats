import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonsMainPage = () => {
  const skeletonCards = Array.from({ length: 12 }).map((_, index) => (
    <div
      key={index}
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-700 hover:shadow-xl"
    >
      <Skeleton height={200} width={300} />
      <div className="p-4 ">
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
      </div>
    </div>
  ));

  return (
    <SkeletonTheme baseColor="#f3f3f3" highlightColor="#e0e0e0">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">{skeletonCards}</div>
    </SkeletonTheme>
  );
};

const SkeletonMap = () => {
  const skeletonMaps = Array.from({ length: 1 }).map((_, index) => (
    <div key={index} className='bg-white rounded-lg shadow-md overflow-hidden transform transition duration-700 hover:shadow-xl'>
      <Skeleton height={400} width={'100%'} />
    </div>
  ));
    return <div className="w-full h-full">
      <SkeletonTheme baseColor="#f3f3f3" highlightColor="#e0e0e0">
        <div>{skeletonMaps}</div>
      </SkeletonTheme>
    </div>
}

export { SkeletonsMainPage, SkeletonMap };