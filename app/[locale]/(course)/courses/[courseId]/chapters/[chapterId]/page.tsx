import Banner from '@/components/global/banner'
import { getChapterForUser } from '@/data'
import { currentUser } from '@/lib/auth'
import { File } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import VideoPlayer from './_components/video-player'
import CourseEnrollButton from './_components/course-enroll-button'
import { Separator } from '@/components/ui/separator'
import CourseProgressButton from './_components/course-progress-button'
import Link from 'next/link'
import { getI18n } from '@/locales/server'

type Props = {
    params: {
        courseId: string
        chapterId: string
    }
}


const page = async({ params } : Props) => {
    
    const user = await currentUser()
    if (!user?.id) {
        return redirect('/sign-in')
    }

    const {
        chapter,
        course,
        attachments,
        nextChapter,
        purchase,
        userProgress
    } = await getChapterForUser({
        courseId: params.courseId,
        userId: user.id,
        chapterId: params.chapterId
    })

    if (!chapter || !course) {
        console.log(course, chapter, nextChapter)
        return redirect('/')
    }

    const isLocked = !chapter.isFree && !purchase
    const completeOnEnd = !!purchase && !userProgress?.isCompleted
    const t =  await getI18n()


    return (
        <div>
            {
                userProgress?.isCompleted && (
                    <Banner variant={"success"} label={t("banner_course_complete")}/>
                )
            }
            {
                isLocked && (
                    <Banner variant={"warning"} label={t("banner_course_chapter")}/>
                )
            }
            <div className='flex flex-col max-w-4xl mx-auto pb-20'>
                <div className='p-4'>
                    <VideoPlayer 
                        chapterId={chapter.id}
                        title={chapter.title}
                        courseId={params.courseId}
                        videoUrl={chapter.videoUrl!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                        nextChapterId={nextChapter?.id}
                    />
                </div>
                <div>
                    <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
                        <h2 className='text-2xl font-semibold mb-2'>
                            {chapter.title}
                        </h2>
                        {
                            purchase ? (
                                <CourseProgressButton 
                                    chapterId={chapter.id}
                                    courseId={params.courseId}
                                    nextChapterId={nextChapter?.id}
                                    isCompleted={!!userProgress?.isCompleted}

                                />
                            ) : (
                                <CourseEnrollButton 
                                    courseId={params.courseId}
                                    price={course.price!}
                                />
                            )
                        }
                    </div>
                    <Separator />
                    <div className='py-4'>
                        <div 
                            dangerouslySetInnerHTML={{ __html: chapter.description! }}
                        />
                    </div>
                    {
                        !!attachments.length && (
                            <>
                                <Separator />
                                <div className='py-4'>
                                    {
                                        attachments.map((attachment, index) => (
                                            <Link href={attachment.id} key={index} target='_blank' rel='noreferrer' className='flex items-center py-3 w-full text-primary hover:underline'>
                                                <File className='h-6 w-6 mr-2'/>
                                                <p className='line-clamp-1'>
                                                    {attachment.name}
                                                </p>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default page