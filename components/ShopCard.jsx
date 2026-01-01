import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons'; // Heart icon from FontAwesome
import { useRouter } from 'next/router';

const FavShopCard = ({ data }) => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col items-center bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 w-full min-w-[220px] max-w-[320px] h-[350px] lg:h-[450px] pb-5 relative cursor-pointer"
      onClick={() => {
        router.push(`shop/${data.storeSlug}`);
      }}
    >
      {/* Like Button (Heart Icon) */}
      <button className="absolute top-4 right-4 text-red-500 text-2xl hover:text-red-600 transition-all duration-300 z-20">
        <FontAwesomeIcon icon={faHeart} />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-[250px] sm:h-[300px] mb-4 z-10">
        <Image
          src={data?.userProfile || "/placeholder.jpg"}
          alt={data.storeTitle}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
        />
      </div>

      {/* Store Name */}
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">{ data.storeTitle.length > 18 ? data.storeTitle.slice(0, 18) + '...' : data.storeTitle}</h3>

      {/* Price */}
      <p className="text-sm font-bold text-gray-900">{data?.firstName + " " + data?.lastName|| "--"}</p>

      {/* Circular Image on the Bottom Border */}
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-white border-4 border-white rounded-full shadow-lg z-10">
        <div className="relative w-20 h-20">
          <Image
            src={data?.storeLogo || "/placeholder.jpg"}
            alt={data.storeTitle}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FavShopCard;
