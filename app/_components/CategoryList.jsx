import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getCategories } from '../_utils/GlobalApiGraph'

const CategoryList = ({categoryList}) => {

    
  return (
    <div className='mt-5'>
        <h2 className=' text-2xl font-semibold my-4'>Shop By Category</h2>
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-5 my-4'>
            {categoryList.categories.map((category,index)=>(
                <Link href={'/products-category/'+category.name} className='flex flex-col items-center justify-end hover:bg-green-200 gap-2 p-3 rounded-lg group cursor-pointer'>
                    <Image src={category.icon.url} width={100} height={100} alt='icon' className=' hover:scale-125 transition-all ease-in-out' />
                    <h2 className='text-center'>{category.name}</h2>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default CategoryList