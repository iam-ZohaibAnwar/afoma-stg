import Image from 'next/image'
import { useRouter } from 'next/router';

const CategoryCard = ({ image, title, data }) => {
  const router = useRouter();
  return (
    <div 
      className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl hover:scale-105 hover:bg-gray-50 transition-all duration-300 max-w-[230px] cursor-pointer"
      onClick={() => {
        // Construct the dynamic URL properly
        const categoryId = data?.Category?.slug;
        const subCategoryId = data?.SubCategory?.slug;

        router.push({
          pathname: '/category/[categoryId]/[subCategoryId]', // Dynamic route path
          query: { 
            categoryId, 
            subCategoryId
          },
        });
      }}
    >
      <div className="relative w-48 h-48 mb-4">
        <Image 
          src={image} 
          alt={title} 
          height={400}
          width={400} 
          objectFit="cover" 
          className="rounded-lg"
          loading='lazy'
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">
        {title.length > 15 ? title.slice(0, 15) + '...' : title}
      </h3>
    </div>
  )
}

export default CategoryCard
