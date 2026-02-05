import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { Role, Permission } from '@prisma/client'
import { z } from 'zod'

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'TEACHER', 'ADMIN']).optional(),
  groupIds: z.array(z.string()).optional(),
  permissions: z.array(z.enum(['CREATE_COURSE', 'EDIT_COURSE', 'DELETE_COURSE', 'PUBLISH_COURSE', 'CREATE_USER', 'EDIT_USER', 'DELETE_USER', 'MANAGE_ROLES', 'VIEW_USERS', 'MANAGE_CONTENT', 'MODERATE_CONTENT', 'VIEW_ANALYTICS', 'EXPORT_DATA', 'MANAGE_SYSTEM', 'VIEW_LOGS'])).optional()
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await currentUser()
    
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasPermission = await db.userPermission.findFirst({
      where: {
        userId: session.id,
        permission: 'EDIT_USER'
      }
    })

    if (!hasPermission && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        groupMemberships: {
          include: {
            group: true
          }
        },
        permissions: {
          select: {
            permission: true,
            grantedAt: true,
            grantedBy: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        createdCourses: {
          select: {
            _count: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await currentUser()
    
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasPermission = await db.userPermission.findFirst({
      where: {
        userId: session.id,
        permission: 'EDIT_USER'
      }
    })

    if (!hasPermission && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, role, groupIds, permissions } = updateUserSchema.parse(body)

    // Check if email already exists (excluding current user)
    const existingUser = await db.user.findFirst({
      where: {
        email,
        NOT: { id: params.id }
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role })
      }
    })

    // Update group memberships
    if (groupIds) {
      // Remove existing memberships
      await db.userGroupMember.deleteMany({
        where: { userId: params.id }
      })

      // Add new memberships
      if (groupIds.length > 0) {
        await db.userGroupMember.createMany({
          data: groupIds.map(groupId => ({
            userId: params.id,
            groupId,
            role: 'USER'
          }))
        })
      }
    }

    // Update permissions
    if (permissions) {
      // Remove existing permissions
      await db.userPermission.deleteMany({
        where: { userId: params.id }
      })

      // Add new permissions
      if (permissions.length > 0) {
        await db.userPermission.createMany({
          data: permissions.map(permission => ({
            userId: params.id,
            permission,
            grantedBy: session.id
          }))
        })
      }
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await currentUser()
    
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasPermission = await db.userPermission.findFirst({
      where: {
        userId: session.id,
        permission: 'DELETE_USER'
      }
    })

    if (!hasPermission && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Don't allow self-deletion for admins
    if (user.id === session.id && user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot delete admin account' }, { status: 400 })
    }

    // Delete user
    await db.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('User deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
