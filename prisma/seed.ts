import { PrismaClient, MetadataKey, AuditLogAction } from '@prisma/client';
const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.auditLog.deleteMany({});
  await prisma.metadata.deleteMany({});
  await prisma.userPermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.userType.deleteMany({});
}

async function main() {
  // Clear the database
  await clearDatabase();

  // Create user types
  const userTypes = await Promise.all([
    prisma.userType.create({
      data: {
        typeName: 'Admin',
        description: 'Administrator with full access',
      },
    }),
    prisma.userType.create({
      data: {
        typeName: 'User',
        description: 'Regular user with limited access',
      },
    }),
    prisma.userType.create({
      data: {
        typeName: 'Guest',
        description: 'Guest user with minimal access',
      },
    }),
  ]);

  // Create a user with typeId 1 (Admin)
  const user = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'admin@mail',
      passwordHash: 'admin',
      typeId: userTypes[0].id, 
    },
  });

  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        permissionName: 'READ',
        description: 'Can view user data',
      },
    }),
    prisma.permission.create({
      data: {
        permissionName: 'WRITE',
        description: 'Can modify user data',
      },
    }),
    prisma.permission.create({
      data: {
        permissionName: 'EDIT',
        description: 'Can edit user data',
      },
    }),
  ]);

  
  const userPermissions = await Promise.all(
    permissions.map((permission) =>
      prisma.userPermission.create({
        data: {
          permissionId: permission.id,
          userId: user.id,
        },
      })
    )
  );

  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        id: 1,
        url: "http://example.com/video1",
        duration: 120,
        body: null,
        type: "Video",
        ownerId: user.id,
      },
    }),
    prisma.activity.create({
      data: {
        id: 2,
        url: "http://example.com/article1",
        duration: null,
        body: "Intro to Activities",
        type: "Article",
        ownerId: user.id,
      },
    }),
    prisma.activity.create({
      data: {
        id: 3,
        url: "http://example.com/article2",
        duration: null,
        body: "Another article content",
        type: "Article",
        ownerId: user.id,
      },
    }),
  ]);

  // Create some metadata using the enum
  const metadata = await Promise.all([
    prisma.metadata.create({
      data: {
        keyName: MetadataKey.THEME,
        value: 'dark',
        userId: user.id,
      },
    }),
    prisma.metadata.create({
      data: {
        keyName: MetadataKey.LANGUAGE,
        value: 'en',
        userId: user.id,
      },
    }),
    prisma.metadata.create({
      data: {
        keyName: MetadataKey.NOTIFICATIONS,
        value: 'enabled',
        userId: user.id,
      },
    }),
  ]);

  // Create some audit logs using the enum
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        action: AuditLogAction.USER_LOGIN,
        userId: user.id,
      },
    }),
    prisma.auditLog.create({
      data: {
        action: AuditLogAction.PERMISSION_ADDED,
        userId: user.id,
      },
    }),
    prisma.auditLog.create({
      data: {
        action: AuditLogAction.PROFILE_UPDATE,
        userId: user.id,
      },
    }),
  ]);

  console.log({ userTypes, user, permissions, userPermissions, activities, metadata, auditLogs });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
