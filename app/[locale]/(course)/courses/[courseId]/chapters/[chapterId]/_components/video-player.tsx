"use client"
import { markChapterAsCompleted } from '@/data'
import { useConfetti } from '@/hooks/use-confetti'
import { cn } from '@/lib/utils'
import { useI18n } from '@/locales/client'
import { Loader2, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'


type Props = {
    chapterId: string
    title: string
    courseId: string
    videoUrl: string
    isLocked: boolean
    nextChapterId?: string
    completeOnEnd: boolean
}

const VideoPlayer = ({ 
    chapterId, 
    title, 
    courseId, 
    videoUrl, 
    isLocked,
    nextChapterId,
    completeOnEnd
 } : Props) => {

    const [isReady, setIsReady] = React.useState(false)
    const router = useRouter()
    const confetti = useConfetti()


    const onEnd = async() => {
        try {
            if (completeOnEnd) {
                await markChapterAsCompleted(chapterId, courseId, true)
                if (!nextChapterId) {
                    confetti.onOpen()
                }
                if (nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
                }
                toast.success('Progress updated')
                router.refresh()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later')
        } 
    }
    const t = useI18n()
    return (
        <div className='relative aspect-video'>
            {
                !isLocked && !isReady && (
                    <div className='absolute inset-0 flex items-center justify-center bg-muted'>
                        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground'/>
                    </div>
                )
            }
            {
                isLocked && (
                    <div className='absolute inset-0 flex items-center flex-col gap-y-2 justify-center bg-muted text-muted-foreground'>
                        <Lock className='h-8 w-8'/>
                        <p className='text-sm'>{t("chapter_locked")}</p>
                    </div>
                )
            }
            {
                !isLocked && (
                    <video
                        title={title}
                        className={cn(
                            "w-full h-full",
                            !isReady && 'hidden'
                        )}
                        onCanPlay={() => setIsReady(true)}
                        onEnded={onEnd}
                        autoPlay
                        controls
                        src={videoUrl}
                    />
                )
            }
        </div>
    )
}

export default VideoPlayer