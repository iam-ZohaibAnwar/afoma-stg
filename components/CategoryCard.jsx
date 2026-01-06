import Image from 'next/image'
import { useRouter } from 'next/router';
import { memo, useCallback } from 'react';

const CategoryCard = memo(({ image, title, data }) => {
  const router = useRouter();
  
  const handleClick = useCallback(() => {
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
  }, [data?.Category?.slug, data?.SubCategory?.slug, router]);

  return (
    <div 
      className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl hover:scale-105 hover:bg-gray-50 transition-all duration-300 max-w-[230px] cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative w-48 h-48 mb-4">
        <Image 
          src={image || '/placeholder.jpg'} 
          alt={title || 'Category'} 
          height={400}
          width={400} 
          className="rounded-lg object-cover"
          loading='lazy'
          sizes="(max-width: 768px) 192px, 192px"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">
        {title && title.length > 15 ? title.slice(0, 15) + '...' : title}
      </h3>
    </div>
  )
});

CategoryCard.displayName = "CategoryCard";

export default CategoryCard
