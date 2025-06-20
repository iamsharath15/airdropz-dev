'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Trash,
  History,
} from 'lucide-react';
import Image from 'next/image';
import StoryForm from './StoryForm';
import axios from 'axios';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import type { StoryCarouselProps, Story } from '@/types';

const STORY_DURATION = 5000;

const StoryCarousel: React.FC<StoryCarouselProps> = ({
  stories,
  setStories,
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

  const handleDelete = async (coverId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/expertStories/v1/top-recommendations-stories/${coverId}`
      );
      setStories((prev) => prev.filter((story) => story.cover_id !== coverId));
      if (selectedStory?.cover_id === coverId) closeStory();
      toast.success('Cover and its stories deleted successfully.');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete story cover.');");
    }
  };

  const handleDeleteStory = async (storyId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/expertStories/v1/top-recommendations-stories/story/${storyId}`
      );

      setStories((prev) =>
        prev.map((s) =>
          s.cover_id === selectedStory?.cover_id
            ? {
                ...s,
                stories: s.stories.filter((story) => story.id !== storyId),
              }
            : s
        )
      );

      if ((selectedStory?.stories.length || 0) <= 1) {
        closeStory();
      } else {
        setCurrentIndex((prev) =>
          prev >= (selectedStory?.stories.length || 0) - 1 ? prev - 1 : prev
        );
      }

      toast.success('Story deleted successfully.');
    } catch (error) {
      console.error('Delete story error:', error);
      toast.error('Failed to delete story.');
    }
  };

  return (
    <>
      <div className="flex gap-6 w-full">
        {stories.length === 0 ? (
          <div className="bg-[#151313] h-auto w-full flex flex-col items-center justify-center rounded-xl px-4">
            <History size={23} />
            <p className="text-center text-sm font-medium pt-2">
              No recommendations available. Use ‘Add Cover’ to create one.{' '}
            </p>
          </div>
        ) : (
          stories.map((story, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center cursor-pointer group"
            >
              <ConfirmDialog
                title="Remove this Cover?"
                description="This will remove the cover from Top Recommendation"
                onConfirm={() => handleDelete(story.cover_id)}
                confirmText="Yes, Remove"
                cancelText="Cancel"
                trigger={
                  <Button className="absolute cursor-pointer top-2 right-2.5 z-10 bg-red-500 text-white w-6 h-6 p-1 rounded-full hover:bg-red-400">
                    <Trash size={12} /> {/* Smaller icon size (in px) */}
                  </Button>
                }
              />

              <div
                onClick={() => openStory(story)}
                className="md:w-20 md:h-20 w-16 h-16 rounded-full bg-[#8373EE] p-1 mb-2 group-hover:scale-105 transition-transform relative"
              >
                <div className="md:w-18 md:h-18 w-14 h-14 bg-gray-800 rounded-full overflow-hidden">
                  {story.cover_image ? (
                    <Image
                      src={story.cover_image}
                      alt={story.cover_name}
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className="w-[80px] h-[80px] bg-gray-200 rounded" />
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {story.cover_name}
              </span>

              <StoryForm
                coverId={story.cover_id}
                onStoryAdded={(newStory) => {
                  setStories((prev) =>
                    prev.map((s) =>
                      s.cover_id === story.cover_id
                        ? { ...s, stories: [...s.stories, newStory] }
                        : s
                    )
                  );
                }}
              />
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
                          {selectedStory.cover_image ? (
                            <Image
                              src={selectedStory.cover_image}
                              alt="cover"
                              width={100}
                              height={100}
                            />
                          ) : (
                            <div className="w-[100px] h-[100px] bg-gray-700 rounded-full" />
                          )}
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
                      {currentStory.image ? (
                        <Image
                          src={currentStory.image}
                          alt="story"
                          width={400}
                          height={400}
                          className="rounded-lg object-cover h-full"
                        />
                      ) : (
                        <div className="w-[400px] h-[400px] bg-gray-700 rounded-lg" />
                      )}
                    </div>
                    <a
                      href={currentStory.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-4 w-6/12 bg-[#8373EE] hover:bg-[#8373EE]/80 text-white text-center mt-4 py-2 rounded-md"
                    >
                      Visit Link
                    </a>

                    <ConfirmDialog
                      title="Remove this Story ?"
                      description="This will remove the Story from Top Recommendation"
                      onConfirm={() => handleDeleteStory(currentStory.id)}
                      confirmText="Yes, Remove"
                      cancelText="Cancel"
                      trigger={
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mb-4 cursor-pointer bg-red-500 hover:bg-red-400"
                        >
                          Delete This Story
                        </Button>
                      }
                    />
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
