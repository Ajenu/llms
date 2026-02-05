import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { Role, Permission } from '@prisma/client'
import { z } from 'zod'

const getUsersSchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  search: z.string().optional(),
  role: z.enum(['USER', 'TEACHER', 'ADMIN']).optional(),
  groupId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await currentUser()
    
    // Check if user has permission to view users
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasPermission = await db.userPermission.findFirst({
      where: {
        userId: session.id,
        permission: 'VIEW_USERS'
      }
    })

    if (!hasPermission && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const { page, limit, search, role, groupId } = getUsersSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      role: searchParams.get('role'),
      groupId: searchParams.get('groupId')
    })

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (groupId) {
      where.groupMemberships = {
        some: {
          groupId: groupId
        }
      }
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          groupMemberships: {
            include: {
              group: true
            }
          },
          permissions: {
            select: {
              permission: true,
              grantedAt: true
            }
          },
          _count: {
            select: {
              courses: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['USER', 'TEACHER', 'ADMIN']),
  groupIds: z.array(z.string()).optional(),
  permissions: z.array(z.enum(['CREATE_COURSE', 'EDIT_COURSE', 'DELETE_COURSE', 'PUBLISH_COURSE', 'CREATE_USER', 'EDIT_USER', 'DELETE_USER', 'MANAGE_ROLES', 'VIEW_USERS', 'MANAGE_CONTENT', 'MODERATE_CONTENT', 'VIEW_ANALYTICS', 'EXPORT_DATA', 'MANAGE_SYSTEM', 'VIEW_LOGS'])).optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await currentUser()
    
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasPermission = await db.userPermission.findFirst({
      where: {
        userId: session.id,
        permission: 'CREATE_USER'
      }
    })

    if (!hasPermission && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, role, groupIds, permissions } = createUserSchema.parse(body)

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        role
      }
    })

    // Add to groups if specified
    if (groupIds && groupIds.length > 0) {
      await db.userGroupMember.createMany({
        data: groupIds.map(groupId => ({
          userId: user.id,
          groupId,
          role: 'USER'
        }))
      })
    }

    // Add permissions if specified
    if (permissions && permissions.length > 0) {
      await db.userPermission.createMany({
        data: permissions.map(permission => ({
          userId: user.id,
          permission,
          grantedBy: session.id
        }))
      })
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
