import React from 'react';

const FeatureComponents = () => {
  return (
    <div className="bg-black w-full flex items-center justify-center flex-col">
      <div className="flex md:flex-row flex-col w-10/12">
        <div className="p-[5%] md:w-6/12 w-full flex items-center justify-center">
          <div className="bg-[#2a2929] rounded-xl h-[400px] w-full"></div>
        </div>
        <div className="md:w-6/12 w-full flex items-start justify-center flex-col md:p-[2%] p-[10%]">
          <h1 className="text-white font-bold text-[38px] pb-1">
            Expert-curated opportunities
          </h1>
          <p className="text-white font-medium">
            Rely on meticulously researched and handpicked strategies by our
            experts, ensuring high-quality insights for successful airdrop
            participation.
          </p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col-reverse w-10/12">
        <div className="md:w-6/12 w-full flex items-start justify-center flex-col md:p-[5%] p-[10%]">
          <h1 className="text-white font-bold text-[38px] pb-1">
            Exclusive Weekly Strategies
          </h1>
          <p className="text-white font-medium">
            Receive insider strategies from experts every week, ensuring a
            consistent flow of valuable airdrop opportunities to enhance your
            crypto portfolio.
          </p>
        </div>
        <div className="p-[5%] md:w-6/12 w-full flex items-center justify-center">
          <div className="bg-amber-300 rounded-xl h-[400px] w-full"></div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col w-10/12">
        <div className="p-[5%] md:w-6/12 w-full flex items-center justify-center">
          <div className="bg-amber-300 rounded-xl h-[400px] w-full"></div>
        </div>
        <div className="md:w-6/12 w-full flex items-start justify-center flex-col md:p-[2%] p-[10%]">
          <h1 className="text-white font-bold text-[38px] pb-1">
            Revolutionizing Airdrop Discovery
          </h1>
          <p className="text-white font-medium">
            Discover a rich tapestry of 200+ airdropable projects, coupled with
            comprehensive guides, simplifying your path to qualifying for each
            one effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureComponents;
