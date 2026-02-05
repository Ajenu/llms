"use client"


import React from 'react'
import { Button } from "@/components/ui/button"
import { z } from 'zod'
import { ImageIcon, Pencil, PlusCircle, Video } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { updateChapterVideo, updateCourseImage } from '@/data'
import Image from 'next/image'
import SupabaseVideoUpload from '@/components/global/supabase-video-upload'
import { Chapter, Course } from '@prisma/client'
import { videoSchema } from '@/schemas'
import { useI18n } from '@/locales/client'

type Props = {
    initialData: Chapter
    courseId: string
    chapterId: string
}


const ChapterVideoForm = ({ courseId, initialData, chapterId } : Props) => {


    const router = useRouter()
    const [isEditing, setIsEditing] = React.useState(false)
    const toggleEditing = () => setIsEditing((prev) => !prev)


    const onSubmit = async(data: z.infer<typeof videoSchema>) => {
        try {

            const response = await updateChapterVideo(courseId, data, chapterId)
            toggleEditing()
            router.refresh()
        } catch (error) {
            toast.error("Failed to update course")
        }
    }

    const t = useI18n()
    
    return (
        <div className='mt-6 border bg-muted text-muted-foreground p-4'>
            <div className='font-medium flex items-center justify-between'>
                {t("chapter_video")}
                <Button 
                    variant={"ghost"}
                    onClick={toggleEditing}
                >
                    {
                        isEditing && <>{t("exit")}</>
                    }
                    {
                        !isEditing && !initialData.videoUrl && (
                            <>
                                <PlusCircle className='h-4 w-4 mr-2'/>
                                {t("add_video")}
                            </>
                        )
                    }
                    {
                        !isEditing && initialData.videoUrl && (
                            <>
                                <Pencil className='h-4 w-4 mr-2'/>
                                {t("edit")}
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    !initialData.videoUrl ? (
                        <div className='flex items-center justify-center h-60 bg-muted rounded-md'>
                            <Video className='h-12 w-12 text-muted-foreground'/>
                        </div>
                    ) : (
                        <div className='relative aspect-video mt-2'>
                            <video
                                className='w-full h-full'
                                controls
                                src={initialData.videoUrl || ''}
                            />
                        </div>
                    )
                )
            }
            {
                isEditing && (
                    <div>
                        <SupabaseVideoUpload
                            onChange={(url?: string) => {
                                if (url) {
                                    onSubmit({'videoUrl': url})
                                }
                            }}
                            value={initialData.videoUrl || undefined}
                        />
                    </div>
                )
            }
            {
                initialData.videoUrl && !isEditing && (
                    <div className='text-xs mt-2 text-muted-foreground'>
                        {t("video_description")}
                    </div>
                )
            }
        </div>
    )
}

export default ChapterVideoForm