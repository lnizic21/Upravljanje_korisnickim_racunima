import app from "../src/server";
import request from "supertest";
import { prisma }  from '../db';

describe('User API', () => {
  beforeEach(async () => {
    await prisma.userType.deleteMany();
    await prisma.user.deleteMany();

    // Dodaj default UserType za testove
    await prisma.userType.create({
      data: { id: '1', typeName: 'Admin', description: 'Administrator' },
    });
  });

  test('GET /users should return an empty array initially', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /users should create a new user', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password',
      typeId: '1',
    };

    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe('John');
    expect(response.body.lastName).toBe('Doe');
  });

  test('PUT /users/:id should update a user', async () => {
    const user = await prisma.user.create({
      data: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        passwordHash: 'hashed_password',
        typeId: '1',
      },
    });

    const updatedUser = {
      firstName: 'Jane Updated',
      lastName: 'Doe Updated',
      email: 'jane.updated@example.com',
      passwordHash: 'new_password',
      status: 'inactive',
    };

    const response = await request(app).put(`/users/${user.id}`).send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe('Jane Updated');
    expect(response.body.status).toBe('inactive');
  });

  test('DELETE /users/:id should delete a user', async () => {
    const user = await prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        passwordHash: 'hashed_password',
        typeId: '1',
      },
    });

    const response = await request(app).delete(`/users/${user.id}`);
    expect(response.status).toBe(204);

    const deletedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(deletedUser).toBeNull();
  });
});