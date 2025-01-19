import { parse } from 'path';
import { prisma }  from '../../db';
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, passwordHash, typeId } = req.body;
  try {
    const user = await prisma.user.create({
        data: {   
            firstName: firstName,
            lastName: lastName,
            email : email,
            passwordHash: passwordHash,
            typeId: typeId,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMetadataByUser = async (req: Request, res: Response) => {
  const { id } = req.params;  // Changed from userId to id to match route parameter
  try {
    const metadata = await prisma.metadata.findMany({
      where: {
        userId: id  // Changed from userId to id
      }
    });
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, passwordHash, typeId, status } = req.body as { firstName: string, lastName: string, passwordHash: string, typeId: string, status: string };
  try {
    console.log('Updating user with ID:', id);
    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        passwordHash,
        typeId: parseInt(typeId),
        status,
      },
    });
    console.log('User updated:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
   
    await prisma.userPermission.deleteMany({
      where: { userId: id }
    });

    // Delete related Metadata records
    await prisma.metadata.deleteMany({
      where: { userId: id }
    });

    // Delete related AuditLog records
    await prisma.auditLog.deleteMany({
      where: { userId: id }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Metadata Handlers
export const createMetadata = async (req: Request, res: Response) => {
  const { keyName, value, userId } = req.body;
  try {
    const metadata = await prisma.metadata.create({
      data: { keyName, value, userId },
    });
    res.status(201).json(metadata);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMetadata = async (req: Request, res: Response) => {
  try {
    const metadataList = await prisma.metadata.findMany();
    res.status(200).json(metadataList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMetadata = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.metadata.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// AuditLog Handlers
export const createAuditLog = async (req: Request, res: Response) => {
  const { action, userId } = req.body;
  try {
    const log = await prisma.auditLog.create({
      data: { action, userId },
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany();
    res.status(200).json(logs);
  } catch (error) {
    res.status (500).json({ error: error.message });
  }
};

export const getAuditLogsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        actionTimestamp: 'desc'
      }
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Permissions Handlers
export const createPermission = async (req: Request, res: Response) => {
  const { permissionName, description } = req.body;
  try {
    const permission = await prisma.permission.create({
      data: { permissionName, description },
    });
    res.status(201).json(permission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPermissions = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const permissions = await prisma.userPermission.findMany({
      where: {
        userId: userId
      },
      include: {
        permission: true
      }
    });
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUserPermissions = async (req: Request, res: Response) => {
  try {
    const userPermissions = await prisma.userPermission.findMany({
      include: {
        user: true,
        permission: true
      }
    });
    res.status(200).json(userPermissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email, passwordHash: password },
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      typeId: user.typeId,                  // Added typeId
      typeName: user.userType?.typeName
    });
    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN',
        userId: user.id
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUserWithEverything = async (req: Request, res: Response) => {
  const { firstName, lastName, email, passwordHash, typeId, permissions, metadata } = req.body;
  try {

  const userType = await prisma.userType.findUnique({
    where: { typeName: typeId }
  });

  if (!userType) {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  const id = userType.id;
  console.log('Creating user with data:', { firstName, lastName, email, passwordHash, id });
    const user = await prisma.user.create({
      data: { firstName, lastName, email, passwordHash, typeId: parseInt(typeId) }
    });
    console.log('User created:', user);

    for (const pid of permissions || []) {
      console.log('Assigning permission:', pid);
      await prisma.userPermission.create({
        data: { userId: user.id, permissionId: pid }
      });
    }
    console.log('Permissions assigned');

    for (const m of metadata || []) {
      console.log('Creating metadata:', m);
      await prisma.metadata.create({
        data: { keyName: m.key, value: m.value, userId: user.id }
      });
    }
    console.log('Metadata created');

    res.status(201).json({ message: 'User + permissions + metadata created', user });
  } catch (error) {
    console.error('Error in createUserWithEverything:', error);
    res.status(400).json({ error: error.message });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  // Expect body: { url, type, duration?, body?, ownerId }
  try {
    const activity = await prisma.activity.create({
      data: {
        url: req.body.url,
        type: req.body.type,
        duration: req.body.duration,
        body: req.body.body,
        ownerId: req.body.ownerId
      }
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getActivities = async (req: Request, res: Response) => {
  try {
    const allActivities = await prisma.activity.findMany();
    res.status(200).json(allActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivitiesByUser = async (req: Request, res: Response) => {
  // URL param: /activities/user/:userId
  try {
    const userId = req.params.userId;
    const userActivities = await prisma.activity.findMany({
      where: { ownerId: userId }
    });
    res.status(200).json(userActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    await prisma.activity.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const updatedActivity = await prisma.activity.update({
      where: { id: parseInt(req.params.id) },
      data: {
        url: req.body.url,
        duration: parseInt(req.body.duration),
        body: req.body.body
      }
    });
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const GetActivitiesById = async (req: Request, res: Response) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const createUserPermission = async (req: Request, res: Response) => {
  const { userId, permissionId } = req.body;
  try {
    const userPermission = await prisma.userPermission.create({
      data: { userId, permissionId }
    });
    res.status(201).json(userPermission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUserPermission = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.userPermission.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
