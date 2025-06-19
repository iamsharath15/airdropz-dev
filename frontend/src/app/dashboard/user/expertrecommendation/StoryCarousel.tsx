'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  History,
} from 'lucide-react';
import Image from 'next/image';

import type { StoryCarouselProps, Story } from '@/types';

const STORY_DURATION = 5000;

const StoryCarousel: React.FC<StoryCarouselProps> = ({
  stories,
}) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStory = selectedStory?.stories[currentIndex];

  useEffect(() => {
    if (!selectedStory || !isPlaying) return;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const isLast = currentIndex >= selectedStory.stories.length - 1;

          if (isLast) {
            closeStory();
          } else {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
          }

          return 0;
        }

        return prev + 100 / (STORY_DURATION / 100);
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedStory, isPlaying, currentIndex]);

  const openStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const closeStory = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelectedStory(null);
    setCurrentIndex(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying((prev) => !prev);
  };

  const goToNext = () => {
    if (selectedStory && currentIndex < selectedStory.stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  return (
    <>
      <div className="flex gap-6 w-full">
        {stories.length === 0 ? (
          <div className="bg-[#151313] h-50 w-full flex flex-col items-center justify-center rounded-xl">
            <History size={30} />
            <p className="text-white/80 text-lg font-medium">
              {' '}
              Recommendation will be added soon.
            </p>
          </div>
        ) : (
          stories.map((story, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center cursor-pointer group"
            >
              <div
                onClick={() => openStory(story)}
                className="md:w-20 md:h-20 w-16 h-16 rounded-full bg-[#8373EE] p-1 mb-2 group-hover:scale-105 transition-transform relative"
              >
                <div className="md:w-18 md:h-18 w-14 h-14 bg-gray-800 rounded-full overflow-hidden">
                  <Image
                    src={story.cover_image}
                    alt={story.cover_name}
                    width={80}
                    height={80}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors capitalize">
                {story.cover_name}
              </span>
            </div>
          ))
        )}
      </div>

      <Dialog
        open={!!selectedStory}
        onOpenChange={(open) => !open && closeStory()}
      >
        <DialogTitle></DialogTitle>
        <DialogContent className="bg-[#2a2a2a] max-w-md p-0 border-0 ">
          {selectedStory &&
            (selectedStory.stories.length === 0 ? (
              <div className="p-6 text-center text-white flex justify-center gap-5 flex-col h-[400px] items-center py-[10%]">
                <History size={50} />
                <p className="text-white mb-4 w-8/12 font-semibold">
                  Recommendation will be added soon. Come back later.
                </p>
              </div>
            ) : (
              currentStory && (
                <div className="relative flex flex-col items-center">
                  <div className="flex gap-1 p-4 pb-2 w-full">
                    {selectedStory.stories.map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden"
                      >
                        <div
                          className="h-full bg-white transition-all duration-100"
                          style={{
                            width:
                              i < currentIndex
                                ? '100%'
                                : i === currentIndex
                                ? `${progress}%`
                                : '0%',
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center p-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                        <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden">
                          <Image
                            src={selectedStory.cover_image}
                            alt="cover"
                            width={100}
                            height={100}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {selectedStory.cover_name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Task {currentIndex + 1} of{' '}
                          {selectedStory.stories.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 absolute z-30 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayPause();
                        }}
                        className="text-gray-400 hover:text-white hover:bg-[#8373EE] cursor-pointer"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 " />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeStory();
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button> */}
                    </div>
                  </div>

                  <div
                    className="absolute z-10 left-0 w-1/12 h-full  cursor-pointer flex items-center justify-start px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev();
                    }}
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className="absolute right-0 w-1/12 h-full z-10 cursor-pointer flex items-center justify-end px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>

                  <div className="w-full flex flex-col items-center relative">
                    <div className="w-[400px] h-[400px]">
                      <Image
                        src={currentStory.image}
                        alt="story"
                        width={400}
                        height={400}
                        className="rounded-lg object-cover h-full"
                      />
                    </div>
                    <a
                      href={currentStory.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-4 w-6/12 bg-[#8373EE] hover:bg-[#8373EE]/80 text-white text-center mt-4 py-2 rounded-md"
                    >
                      Visit Link
                    </a>
                  </div>
                </div>
              )
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryCarousel;
