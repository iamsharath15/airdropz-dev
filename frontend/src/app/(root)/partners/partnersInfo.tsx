import { partnersData } from '@/lib/constants';
import React from 'react'

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};
const PartnersInfo = () => {
  const groupedPartners = chunkArray(partnersData, 3)
  return (
    <div className='flex items-center justify-center w-8/12'>
      <div className='container'>
      {groupedPartners.map((group, rowIndex) => (
          <div className="flex flex-col md:flex-row" key={rowIndex}>
            {group.map((partner, index) => (
              <div className="flex flex-col p-[3%] gap-4 border-[1px] border-[#ffffff1a] cursor-pointer hover:bg-[linear-gradient(314deg,_#1a1d32,_rgba(26,29,50,0))]" key={index}>
                <div className="cus-logo py-[8%]">
                  <img src={partner.logo} alt={partner.name} />
                </div>
                <div className="flex items-center justify-center ">
                  <p className='text-white'>{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
    </div>
  )
}

export default PartnersInfo