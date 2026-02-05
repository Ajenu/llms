"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Video, Upload, X } from "lucide-react"
import { toast } from "sonner"

type SupabaseVideoUploadProps = {
    onChange: (url?: string) => void;
    value?: string;
};

export default function SupabaseVideoUpload({ onChange, value }: SupabaseVideoUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('video/')) {
            toast.error('Please upload a video file')
            return
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            toast.error('Video file must be less than 100MB')
            return
        }

        setIsUploading(true)
        setProgress(0)

        try {
            const fileName = `video-${Date.now()}-${file.name}`
            
            // Create a FormData object for the upload
            const formData = new FormData()
            formData.append('file', file)
            formData.append('fileName', fileName)

            const xhr = new XMLHttpRequest()

            // Track upload progress
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100
                    setProgress(percentComplete)
                }
            })

            // Handle completion
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText)
                    onChange(response.publicUrl)
                    toast.success('Video uploaded successfully')
                } else {
                    toast.error('Upload failed')
                }
                setIsUploading(false)
                setProgress(0)
            })

            // Handle errors
            xhr.addEventListener('error', () => {
                toast.error('Upload failed')
                setIsUploading(false)
                setProgress(0)
            })

            // Upload to our API endpoint
            xhr.open('POST', '/api/upload-video')
            xhr.send(formData)

        } catch (error) {
            toast.error('Upload failed')
            setIsUploading(false)
            setProgress(0)
        }
    }

    const handleRemove = () => {
        onChange(undefined)
    }

    return (
        <div className='space-y-4'>
            {value ? (
                <div className='relative aspect-video bg-muted rounded-md overflow-hidden'>
                    <video 
                        className='w-full h-full object-cover'
                        controls
                        src={value}
                    />
                    <Button
                        onClick={handleRemove}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center h-60 bg-muted rounded-md border-2 border-dashed border-muted-foreground/25'>
                    {isUploading ? (
                        <div className='flex flex-col items-center space-y-2 w-full max-w-xs'>
                            <div className='animate-spin'>
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className='text-sm text-muted-foreground'>Uploading video...</p>
                            <Progress value={progress} className="w-full" />
                            <p className='text-xs text-muted-foreground'>{Math.round(progress)}%</p>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center space-y-2'>
                            <Video className="h-12 w-12 text-muted-foreground" />
                            <label htmlFor="video-upload">
                                <Button variant="outline" asChild>
                                    <span>Choose Video</span>
                                </Button>
                                <input
                                    id="video-upload"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                            <p className='text-xs text-muted-foreground'>
                                MP4, WebM, or OGG (max 100MB)
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
