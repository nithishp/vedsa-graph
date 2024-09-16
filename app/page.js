import { Button } from "@/components/ui/button";
import Image from "next/image";
import Sliders from "./_components/Sliders";
import GlobalApi from "./_utils/GlobalApi";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import banner from './assets/img/cto.svg'
import Footer from "./_components/Footer";
import { getCategories, getProducts } from "./_utils/GlobalApiGraph";



export default async function Home() {

  const categoryList = await getCategories()
  const ProductsList = await getProducts()
  return (
    <div className="p-5  md:p-10 px-16 ">
      <Sliders />
      <CategoryList categoryList={categoryList}/>
      <ProductList productsList = {ProductsList}/>
      <Image src={banner} width={1000} height={300} className="w-full h-[200px] my-6 md:h-[500px] object-contain" alt="banner" />
      <Footer/>
    </div>
  );
}
 