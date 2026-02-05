"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatPrice } from "@/lib/format"
import { stripe } from "@/lib/stripe"
import { CourseProgressWithCatgeroy, CourseWithCategory, DashboardCoursesWithProgressWithCategory, GetCourses, GetCoursesWithoutProgress } from "@/lib/types"
import { supabaseAdmin, SUPABASE_STORAGE_BUCKET } from "@/lib/supabase"
import { Attachment, Chapter } from "@prisma/client"
import { url } from "inspector"
import { redirect } from "next/navigation"
import Stripe from "stripe"



const _isUserAuth = async () => {
    try {
        const auth = await currentUser()
        if (!auth || !auth.email) {
            throw new Error("You must be logged in to create a course")
        }
        const user = await db.user.findUnique({
            where: {
                email: auth.email
            }
        })
        if (!user) {
            throw new Error("User not found")
        }

        return user
    } catch (error) {
        console.log("An error occurred in _isUserAuth", error)
        throw error
    }
}


export const createCourse = async (
    data: { title: string }
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.create({
            data: {
                title: data.title,
                teacherId: user.id
            }
        })

        return course
    } catch (error) {
        console.log("An error occurred in createCourse", error)
        throw error
    }
}


export const getCourse = async (courseId: string) => {
    try {

        const user = await _isUserAuth()

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                teacherId: user.id
            },
            include: {
                attachments: true,
                chapters: {
                    orderBy: {
                        position: "asc"
                    },
                }
            }
        })

        return course
    } catch (error) {
        console.log("An error occurred in getCourse", error)
        throw error
    }
}


export const updateCourseTitle = async (
    courseId: string,
    data: { title: string }
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                title: data.title
            }
        })

        return course
    } catch (error) {
        console.log("An error occurred in updateCourseTitle", error)
        throw error
    }
}


export const updateCourseDescription = async (
    courseId: string,
    data: { description: string }
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                description: data.description
            }
        })

        return course
    } catch (error) {
        console.log("An error occurred in updateCourseDescription", error)
        throw error
    }
}


export const updateCourseImage = async (
    courseId: string,
    data: { imageUrl: string }
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                imageUrl: data.imageUrl
            }
        })

        return course
    } catch (error) {
        console.log("An error occurred in updateCourseImage", error)
        throw error
    }
}


export const getCategories = async () => {
    try {

        const categories = await db.category.findMany({
            orderBy: {
                name: "asc"
            }
        })

        return categories
    } catch (error) {
        console.log("An error occurred in getCategories", error)
        throw error
    }
}

export const updateCourseCategory = async (
    courseId: string,
    data: { categoryId: string }
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                categoryId: data.categoryId
            }
        })
    } catch (error) {
        console.log("An error occurred in updateCourseCategory", error)
        throw error
    }
}


export const updateCoursePrice = async (
    courseId: string,
    data: { price: number }
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                price: data.price
            }
        })

        return course
    } catch (error) {
        console.log("An error occurred in updateCoursePrice", error)
        throw error
    }
}


export const updateCourseAttachment = async (
    courseId: string,
    data: { url: string }
) => {
    try {
        const user = await _isUserAuth()

        const attachment = await db.attachment.create({
            data: {
                url: data.url,
                courseId: courseId,
                name: data.url.split('/').pop()
            }
        })

        return attachment
    } catch (error) {
        console.log("An error occurred in updateCourseAttachment", error)
        throw error
    }
}


export const deleteCourseAttachment = async (
    courseId: string,
    id: string
) => {
    try {
        const user = await _isUserAuth()

        const attachment = await db.attachment.delete({
            where: {
                id: id,
                courseId: courseId
            }
        })

        return attachment
    } catch (error) {
        console.log("An error occurred in deleteCourseAttachment", error)
        throw error
    }
}


export const updateCourseChapters = async (
    courseId: string,
    data: { title: string }
) => {
    try {
        const user = await _isUserAuth()

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId
            },
            orderBy: {
                position: "desc"
            }
        })
        const newPosition = lastChapter ? lastChapter.position + 1 : 1


        const chapter = await db.chapter.create({
            data: {
                title: data.title,
                courseId: courseId,
                position: newPosition
            }
        })

        return chapter
    } catch (error) {
        console.log("An error occurred in updateCourseChapters", error)
        throw error
    }
}


export const updateChaptersOrder = async (
    courseId: string,
    data: { id: string; position: number }[]
) => {
    try {
        const user = await _isUserAuth()

        for (let item of data) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            })
        }

        
        return { success: true }
    } catch (error) {
        console.log("An error occurred in updateChaptersOrder", error)
        throw error
    }
}


export const getChapter = async (
    chapterId: string,
    courseId: string
) => {
    try {
        const user = await _isUserAuth()

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        })

        return chapter
    } catch (error) {
        console.log("An error occurred in getChapter", error)
        throw error
    }
}


export const updateChapterTitle = async (
    courseId: string,
    data: { title: string },
    chapterId: string
) => {
    try {
        const user = await _isUserAuth()


        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                title: data.title
            }
        })

        return chapter
    } catch (error) {
        console.log("An error occurred in updateChapterTitle", error)
        throw error
    }
}


export const updateChapterDescription = async (
    courseId: string,
    data: { description: string },
    chapterId: string
) => {
    try {
        const user = await _isUserAuth()


        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                description: data.description
            }
        })

        return chapter
    } catch (error) {
        console.log("An error occurred in updateChapterDescription", error)
        throw error
    }
}


export const updateChapterisFree = async (
    courseId: string,
    data: { isFree: boolean },
    chapterId: string
) => {
    try {
        const user = await _isUserAuth()


        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isFree: data.isFree
            }
        })

        return chapter
    } catch (error) {
        console.log("An error occurred in updateChapterisFree", error)
        throw error
    }
}


export const updateChapterVideo = async (
    courseId: string,
    data: { videoUrl: string },
    chapterId: string
) => {
    try {
        const user = await _isUserAuth()

        // The videoUrl is now already a Supabase URL from direct upload
        // Just update the chapter with the URL
        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                videoUrl: data.videoUrl
            }
        })

        return chapter
    } catch (error) {
        console.log("An error occurred in updateChapterVideo", error)
        throw error
    }
}


export const deleteChapter = async (
    courseId: string,
    chapterId: string
) => {
    try {
        const user = await _isUserAuth()

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        })
        if (!chapter) {
            throw new Error("Chapter not found")
        }

        if (chapter.videoUrl) {
            // Extract filename from Supabase URL
            // Supabase URLs look like: https://project-id.supabase.co/storage/v1/object/public/course-videos/filename
            try {
                const url = new URL(chapter.videoUrl)
                const pathParts = url.pathname.split('/')
                const fileName = pathParts[pathParts.length - 1]
                
                if (fileName) {
                    // Delete video from Supabase Storage
                    const { error: deleteError } = await supabaseAdmin.storage
                        .from(SUPABASE_STORAGE_BUCKET)
                        .remove([fileName])
                    
                    if (deleteError) {
                        console.error('Failed to delete video from storage:', deleteError)
                    }
                }
            } catch (error) {
                console.error('Failed to parse video URL for deletion:', error)
            }
        }

        await db.chapter.delete({
            where: {
                id: chapterId
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
        })
        if (publishedChaptersInCourse.length === 0) {
            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            })
        }


        return chapter
    } catch (error) {
        console.log("An error occurred in deleteChapter", error)
        throw error
    }
}


export const publishChapter = async (
    courseId: string,
    chapterId: string
) => {
    try {
        const user = await _isUserAuth()

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        })

        return chapter
    } catch (error) {
        console.log("An error occurred in publishChapter", error)
        throw error
    }
}


export const unpublishChapter = async (
    courseId: string,
    chapterId: string
) => {
    try {
        const user = await _isUserAuth()

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: false
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
        })
        if (publishedChaptersInCourse.length === 0) {
            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            })
        }


        return chapter
    } catch (error) {
        console.log("An error occurred in unpublishChapter", error)
        throw error
    }
}


export const unpublishCourse = async (
    courseId: string
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.update({
            where: {
                id: courseId,
                teacherId: user.id
            },
            data: {
                isPublished: false
            }
        })

        return course
    } catch (error) {
        console.log("An error occurred in unpublishCourse", error)
        throw error
    }
}


export const publishCourse = async (
    courseId: string
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                chapters: true
            }
        })

        if (!course) {
            throw new Error("Course not found")
        }

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished)

        if(!hasPublishedChapter) {
            throw new Error("You must have at least one published chapter to publish the course")
        }

        await db.course.update({
            where: {
                id: courseId
            },
            data: {
                isPublished: true
            }
        })

        return course
    } catch (error) {
        console.log("An error occurred in publishCourse", error)
        throw error
    }
}


export const deleteCourse = async (
    courseId: string
) => {
    try {
        const user = await _isUserAuth()

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                teacherId: user.id
            },
            include: {
                chapters: true
            }
        })
        if (!course) {
            throw new Error("Course not found")
        }

        for (let chapter of course.chapters) {
            if (chapter.videoUrl) {
                // Extract filename from Supabase URL
                try {
                    const url = new URL(chapter.videoUrl)
                    const pathParts = url.pathname.split('/')
                    const fileName = pathParts[pathParts.length - 1]
                    
                    if (fileName) {
                        // Delete video from Supabase Storage
                        const { error: deleteError } = await supabaseAdmin.storage
                            .from(SUPABASE_STORAGE_BUCKET)
                            .remove([fileName])
                        
                        if (deleteError) {
                            console.error('Failed to delete video from storage:', deleteError)
                        }
                    }
                } catch (error) {
                    console.error('Failed to parse video URL for deletion:', error)
                }
            }
        }
  
        const deleteCourse = await db.course.delete({
            where: {
                id: courseId
            }
        })

        return deleteCourse
    } catch (error) {
        console.log("An error occurred in deleteCourse", error)
        throw error
    }
}


export const getCourses = async () => {
    try {
        const user = await _isUserAuth()

        const courses = await db.course.findMany({
            where: {
                teacherId: user.id
            },
            include: {
                chapters: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        const coursesWithChapters = courses.map((course) => {
            return {
                ...course,
                chapters: course.chapters.length
            }
        })

        return coursesWithChapters

    } catch (error) {
        console.log("An error occurred in getCourses", error)
        throw error
    }
}


export const getUserCourses = async () => {
    try {
        const courses = await db.course.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
    
        return courses 
    } catch (error) {
        console.log("An error occurred in getUserCourses", error)
        return []
    }
}

export const getProgress = async (courseId: string) => {
    try {
        const user = await _isUserAuth()

        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            },
            select: {
                id: true
            }
        })
        const publishedChaptersIds = publishedChapters.map((chapter) => chapter.id)

        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId: user.id,
                chapterId: {
                    in: publishedChaptersIds
                },
                isCompleted: true
            }
        })

        const progress = (validCompletedChapters / publishedChaptersIds.length) * 100

        return progress

    } catch (error) {
        console.log("An error occurred in getProgress", error)
        throw error
    }
}



export const getCoursesWithProgress = async ({
    userId,
    title,
    categoryId
}: GetCourses)  => {
    try {

        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const coursesWithProgress: CourseProgressWithCatgeroy[] = await Promise.all(
            courses.map(async (course) => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null
                    }
                }
                const progress = await getProgress(course.id)

                return {
                    ...course,
                    progress: progress
                }
            })
        )

        return coursesWithProgress
    } catch (error) {
        console.log("An error occurred in getCourseProgress", error)
        return []
    }
}


export const getCoursesWithoutProgress = async ({
    title,
    categoryId
}: GetCoursesWithoutProgress)  => {
    try {

        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const coursesWithProgress: CourseWithCategory[] = await Promise.all(
            courses.map(async (course) => {

                return {
                    ...course,
                }
            })
        )

        return coursesWithProgress
    } catch (error) {
        console.log("An error occurred in getCoursesWithoutProgress", error)
        return []
    }
}


export const getCourseForUser = async (courseId: string) => {

    const user = await _isUserAuth()
    try {
        const course = await db.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                chapters: {
                    where: {
                        isPublished: true
                    },
                    include: {
                        useProgress: {
                            where: {
                                userId: user.id
                            }
                        }
                    },
                    orderBy: {
                        position: "asc"
                    }
                },
            },
        })

        if (!course) {
            return redirect('/')
        }


        return course
    } catch (error) {
        console.log("An error occurred in getCourseForUser", error)
        throw error
    }
}


export const getCoursePurchase = async (courseId: string) => {
    try {
        const user = await _isUserAuth()

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        })
        
        return purchase
    } catch (error) {
        console.log("An error occurred in getCoursePurchase", error)
        throw error
    }
}



export const getChapterForUser = async ({
    courseId,
    userId,
    chapterId
}: {
    courseId: string,
    userId: string,
    chapterId: string
}) => {
    try {
        const user = await _isUserAuth()

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        })
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            },
            select: {
                price: true
            }
        })
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            }
        })
        if (!chapter || !course) {
            throw new Error("Chapter or course not found")
        }

        let attachments: Attachment[] = []
        let nextChapter: Chapter | null = null

        if (purchase) {

            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId
                }
            })

        }

        if (purchase || chapter.isFree) {
            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    position: {
                        gt: chapter.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            })
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        })
        
        return {
            chapter,
            course,
            attachments,
            nextChapter,
            userProgress,
            purchase
        }
    } catch (error) {
        console.log("An error occurred in getChapter", error)
        return {
            chapter: null,
            course: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        }
    }
}



export const stripeCheckout = async (
    courseId: string
) => {
    try {
        
        const user = await currentUser()
        if (!user || !user.id || !user.email) {
            throw new Error("Unauthorized")
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            }
        })

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    courseId: courseId,
                    userId: user.id
                }
            }
        })

        if(purchase) {
            throw new Error("This course is already purchase")
        }

        if(!course) {
            throw new Error("Course not found")
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title,
                        description: course.description!,
                        images: [course.imageUrl!]
                    },
                    unit_amount: Math.round(course.price! * 100)
                },
                quantity: 1
            }
        ]

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true
            }
        })

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.email
            })


            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.APP_URL}/courses/${courseId}?success=true`,
            cancel_url: `${process.env.APP_URL}/courses/${courseId}?canceled=true`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        })

        return {url: session.url}

    } catch (error) {
        console.log("STRIPE_CHECKOUT_SESSION_ERROR", error)
        throw error
    }
}



export const markChapterAsCompleted = async (
    chapterId: string,
    courseId: string,
    isCompleted: boolean
) => {
    try {
        const user = await _isUserAuth()

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId: user.id,
                    chapterId
                }
            },
            create: {
                userId: user.id,
                chapterId,
                isCompleted,
            },
            update: {
                isCompleted
            }
        })

        return userProgress
    } catch (error) {
        console.log("An error occurred in markChapterAsCompleted", error)
        throw error
    }
}



export const getDashboardCourses = async () => {
    try {
        const user = await _isUserAuth()

        const purchaseCourses = await db.purchase.findMany({
            where: {
                userId: user.id
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            },
                        }
                    },
                }
            }
        })

        const courses = purchaseCourses.map((purchase) => purchase.course) as DashboardCoursesWithProgressWithCategory[]

        for (let course of courses) {
            const progress = await getProgress(course.id)
            course.progress = progress
        }

        const completedCourses = courses.filter((course) => course.progress === 100)
        const inProgressCourses = courses.filter((course) => course.progress !== 100)
        return {
            completedCourses,
            inProgressCourses
        }
    } catch (error) {
        console.log("An error occurred in getDashboardCourses", error)
        return {
            completedCourses: [],
            inProgressCourses: []
        }
    }
}




export async function getMonthlyRevenue() {
    try {
        const user = await _isUserAuth();
        const purchases = await db.purchase.findMany({
            where: {
                userId: user.id
            },
            include: {
                course: true,
            },
        });
    
        const currentYear = new Date().getFullYear();

        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1);
        // Use Intl.DateTimeFormat to format the month in English
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
        const revenue = purchases
            .filter(p => p.createdAt.getMonth() === i && p.createdAt.getFullYear() === currentYear)
            .reduce((acc, p) => acc + (p.course.price || 0), 0);
        
        return { 
            month, 
            revenue,
        };
        });
    
        return monthlyRevenue;
    } catch (error) {
        console.log("An error occurred in getMonthlyRevenue", error);
        return [];
        
    }
}

export async function getStudentEnrollment() {
    try {
        const user = await _isUserAuth();
        const purchases = await db.purchase.findMany({
            where: {
                userId: user.id
            },
        });

        const currentYear = new Date().getFullYear();

        const monthlyEnrollment = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(currentYear, i, 1);

            // Use Intl.DateTimeFormat to format the month in English
            const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            
            const enrollment = purchases.filter(p => 
                p.createdAt.getMonth() === i &&
                p.createdAt.getFullYear() === currentYear
            ).length;

            return { month, enrollment };
        });

        return monthlyEnrollment;
    } catch (error) {
        console.log("An error occurred in getStudentEnrollment", error);
        return [];
    }
}


export async function getCourseChapters() {
  try {
    const user = await _isUserAuth();
    const courses = await db.course.findMany({
        where: {
        teacherId: user.id
        },
        include: {
        chapters: true,
        },
    });

    return courses.map(course => ({
        title: course.title,
        chapters: course.chapters.length,
    }));
  } catch (error) {
    console.log("An error occurred in getCourseChapters", error);
    return [];
  }
}

export async function getCoursePerformance() {
    try {
        const user = await _isUserAuth();
        const courses = await db.course.findMany({
            where: {
            teacherId: user.id
            },
            include: {
            purchases: true,
            },
        });
    
        const totalPurchases = courses.reduce((acc, course) => acc + course.purchases.length, 0);
    
        return courses.map(course => ({
            title: course.title,
            students: course.purchases.length,
            percentage: (course.purchases.length / totalPurchases) * 100,
        }));
    } catch (error) {
        console.log("An error occurred in getCoursePerformance", error);
        return []
        
    }
}

