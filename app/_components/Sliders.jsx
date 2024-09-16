import React from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getSlidersGraph } from '../_utils/GlobalApiGraph'


const Sliders = async() => {
  const sliderList = await getSlidersGraph()
  return (
//     <Carousel>
//   <CarouselContent>
//     {sliderList.map((slider,index)=>(
//     <CarouselItem key={index}>
//       <Image src={slider.attributes?.image?.data[0].attributes?.url} width={1000} height={400} alt='slider' className='w-full h-[200px] md:h-[400px] object-cover rounded-2xl'/>
//     </CarouselItem>

//     ))}
   
//   </CarouselContent>
//   <CarouselPrevious />
//   <CarouselNext />
// </Carousel>
    <Carousel>
  <CarouselContent>
   {sliderList.sliders.map((item,index)=>(
        <CarouselItem key={index}>
      <Image src={item.image.url} width={1000} height={400} alt='slider' className='w-full h-[200px] md:h-[400px] object-cover rounded-2xl'/>
    </CarouselItem>
   ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
  )
}

export default Sliders