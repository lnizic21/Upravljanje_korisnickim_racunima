import { Router } from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, createUserWithEverything } from './handlers/userHandlers';
import path from 'path';

import {
  createMetadata, getMetadata, deleteMetadata,
  createAuditLog, getAuditLogs,
  createPermission, getPermissions, getAllUserPermissions, getUserPermissions,
   getAuditLogsByUser, getMetadataByUser, loginUser,
  createActivity, getActivities, getActivitiesByUser, deleteActivity, createUserPermission, deleteUserPermission, updateActivity, GetActivitiesById
} from './handlers/userHandlers';

const router = Router();

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.post('/metadata', createMetadata);
router.get('/metadata', getMetadata);
router.get('/metadata/user/:id', getMetadataByUser);  
router.delete('/metadata/:id', deleteMetadata);

router.post('/auditlogs', createAuditLog);
router.get('/auditlogs', getAuditLogs); 
router.get('/auditlogs/user/:userId', getAuditLogsByUser); 

router.post('/permissions', createPermission);
router.get('/permissions', getPermissions); 
router.get('/permissions/user/:userId', getUserPermissions); 


router.get('/usersPermissions', getAllUserPermissions);

router.get('/user/permissions/:id', getUserPermissions);

router.post('/auth/login', loginUser);

router.post('/users/everything', createUserWithEverything);

// Activity routes
router.post('/activities', createActivity);
router.get('/activities', getActivities);
router.get('/activities/user/:userId', getActivitiesByUser);
router.delete('/activities/:id', deleteActivity);
router.get('/activities/:id', GetActivitiesById);


router.post('/userPermissions', createUserPermission);
router.delete('/userPermissions/:id', deleteUserPermission);

router.put('/activities/:id', updateActivity);

// Keep userPermissions routes:
router.post('/userPermissions', createUserPermission);
router.delete('/userPermissions/:id', deleteUserPermission)


export default router;