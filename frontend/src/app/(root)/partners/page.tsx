import { Button } from '@/components/ui/button';
import React from 'react';
import PartnersInfo from './partnersInfo';

const page = () => {
  return (
    <section className="partners-section ">
      {/*Became Partner */}

      <div className="flex w-full items-center justify-center p-2 py-[10%]">
        <div className="container flex items-center justify-center">
          <div className="md:w-6/12 w-8/12 text-center space-y-6">
            <h2 className="text-white font-semibold lg:text-5xl md:text-3xl sm:text-xl">
              Partners
            </h2>
            <p className="text-white font-normal text-lg">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut
              maxime, necessitatibus autem quos possimus corporis? Quos animi
              omnis quam quibusdam.
            </p>
            <Button className="bg-[#672FDB] rounded-2xl">
              <a href="#">Became a partner</a>
            </Button>
          </div>
        </div>
      </div>
      {/*Partner Info*/}
      <div className="w-full flex items-center justify-center py-[5%]">
        <PartnersInfo />
      </div>
      {/*Partner-Callout */}
      <section className="flex w-full items-center justify-center px-[4%] py-[10%] ">
        <div className="container flex items-center justify-center bg-[linear-gradient(86deg,_#670fff,_#d44ee3,_#f09d44)] rounded-4xl py-[16%] px-[4%]">
          <div className="md:w-6/12 w-8/12 text-center space-y-6">
            <h2 className="text-white  font-semibold lg:text-5xl md:text-3xl sm:text-xl">Collaborate with confidence.</h2>
            <p className="text-white font-normal text-lg">
              Securely share opportunities, protect sensitive data, and build
              trust—all while staying compliant and ahead of the curve in the
              Web3 space.
            </p>
            <Button className="bg-white rounded-2xl text-black">
              <a href="#">Begin now</a>
            </Button>{' '}
          </div>
        </div>
      </section>
    </section>
  );
};

export default page;
