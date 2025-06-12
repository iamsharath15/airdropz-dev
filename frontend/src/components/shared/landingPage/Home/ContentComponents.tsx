import React from 'react';

const ContentComponents = () => {
  return (
    <section className="bg-black w-full flex items-center justify-center flex-col">
      <div className="flex flex-col w-10/12">
        <div className="py-[4%]">
          <h1 className="text-white text-5xl font-bold leading-[1.2]">
            Claim smarter. Earn faster.<br></br> Only on Airdropz.
          </h1>
        </div>
        <div className=" flex flex-col">
          <div className=" overflow-hidden p-2">
            <div className="bg-[#8373EE] p-[1%] rounded-lg">
              <video
                src="https://cdn.lootcrate.me/video/test.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="flex">
            <div className="w-6/12 p-2">
              <div className="bg-[#8373EE] p-[2%] rounded-lg">
                <video
                  src="https://cdn.lootcrate.me/video/test.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div className="w-6/12 p-2">
              <div className="bg-[#8373EE] p-[2%] rounded-lg">
                <video
                  src="https://cdn.lootcrate.me/video/test.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-4/12 p-2">
            <div className="bg-[#8373EE] py-[15%] px-[6%] rounded-xl">
              <h1 className="">Unlock Your airdrops</h1>
              <p className="">
                Your gateway to airdrop prosperity starts here. Join Earn3 now
                for a revolutionary approach to maximizing your crypto gains.
              </p>
            </div>
          </div>
          <div className="w-4/12 p-2">
            <div className="bg-red-400 py-[15%] px-[6%] rounded-xl">
              <h1 className="">Unlock Your airdrops</h1>
              <p className="">
                Your gateway to airdrop prosperity starts here. Join Earn3 now
                for a revolutionary approach to maximizing your crypto gains.
              </p>
            </div>
          </div>
          <div className="w-4/12 p-2 ">
            <div className="bg-[#8373EE] py-[15%] px-[6%] rounded-xl h-full flex items-center justify-center">
              <h1 className="text-3xl text-center text-white">
                Checkout Recent airdrops
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentComponents;
