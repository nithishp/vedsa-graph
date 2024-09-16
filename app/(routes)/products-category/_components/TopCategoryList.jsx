import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TopCategoryList = ({categoryList,selectedCategory}) => {

  return (
    <div className='flex gap-5 my-4 overflow-auto mx-7 md:mx-20 justify-center'>
            {categoryList.categories.map((category,index)=>(
                <Link href={'/products-category/'+category.name} className={`flex flex-col items-center justify-end  gap-2 p-3 rounded-lg group cursor-pointer w-[150px] min-w-[100px] ${selectedCategory == category.name && "bg-primary text-white"} `}>
                    <Image src={category.icon.url} width={50} height={50} alt='icon' className=' hover:scale-125 transition-all ease-in-out' />
                    <h2 className='text-center'>{category.name}</h2>
                </Link>
            ))}
        </div>
  )
}

export default TopCategoryList