import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const WelcomeCard = () => {
  return (
        <Card className="bg-[#151313] border-none mb-6 md:mb-8">
            <CardContent className="p-4 md:p-8 flex flex-col items-center">
              <div className="text-center mb-4">
                <p className="text-white">Monday, Apr 14</p>
                <h1 className="text-2xl md:text-3xl font-bold mt-1 text-white">
                  Welcome, user 1
                </h1>
              </div>

              <div className="flex flex-col md:flex-row gap-4 bg-[#8373EE] w-full max-w-xl rounded-xl px-4 py-3 justify-center">
                <div className="border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-4 border-white text-center md:text-left">
                  <span className="text-white font-bold">04 Check In</span>
                </div>
                <div className="border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-4 border-white text-center md:text-left">
                  <span className=" text-white font-bold">
                    400{' '}
                    <span className="text-sm ">
                      Airdrops earned
                    </span>
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-white font-bold">
                    400{' '}
                    <span className="text-sm text-white">
                      Airdrops Remaining
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
  )
}

export default WelcomeCard