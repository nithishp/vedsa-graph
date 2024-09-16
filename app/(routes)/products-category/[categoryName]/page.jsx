import GlobalApi from '@/app/_utils/GlobalApi'
import React from 'react'
import TopCategoryList from '../_components/TopCategoryList'
import ProductList from '@/app/_components/ProductList'
import { getCategories, getProductsByCategories } from '@/app/_utils/GlobalApiGraph'

const ProductCategory = async({params}) => {
    const decodedCategoryName = decodeURIComponent(params.categoryName)
    const categoryList = await getCategories();
    const productsList = await getProductsByCategories(decodedCategoryName);

    // Decode the category name

    return (
        <div>
            <h2 className='p-4 bg-primary text-white text-3xl font-semibold text-center'>
                {decodedCategoryName}   
            </h2>
            <TopCategoryList selectedCategory={decodedCategoryName} categoryList={categoryList} />
            <div className='p-5 md:p-10' >
                <ProductList productsList={productsList} />
            </div>
        </div>
    )
}

export default ProductCategory
