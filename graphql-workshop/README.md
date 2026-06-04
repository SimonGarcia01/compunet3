# GraphQL Workshop  
Simon Garcia  

## Technologies  
NestJS, TypeORM, GraphQL, Apollo Server  

---

## Overview  
This project is a GraphQL Workshop API built with NestJS, TypeORM, GraphQL, and Apollo Server. It demonstrates authentication, authorization, and role-based access control using JWT.

---

## Getting Started  

### Install dependencies  
It is recommended to use Bun:

```bash
bun install
```

### Run the project

```bash
bun start
```

---

## Authentication & Authorization  

The system uses JWT-based authentication.

### Public operations (no authentication required):
- runSeed
- signup
- login

All other queries and mutations require:

Authorization: Bearer <token>

---

## Roles & Permissions Model  

### Roles
- SUPER_ADMIN
- USER

### Permissions
- ADMIN_SUPER_POWER
- READ_USERS
- CREATE_POSTS
- READ_POSTS
- UPDATE_POSTS
- DELETE_POSTS

---

## Role → Permission Mapping

| Role         | Permissions |
|--------------|-------------|
| SUPER_ADMIN  | ADMIN_SUPER_POWER |
| USER         | READ_USERS, CREATE_POSTS, READ_POSTS, UPDATE_POSTS, DELETE_POSTS |

---

## Authorization Rules  

- SUPER_ADMIN
  - Has full system access
  - Can access all entities (users, roles, permissions, posts)
  - Can perform all mutations without restriction

- USER
  - Can only perform CRUD on their own posts
  - Has limited access based on permissions

---

## GraphQL API Overview  

### Users
- users
- user(id)
- createUser
- updateUser
- removeUser

### Posts
- posts
- post(id)
- createPost
- updatePost
- removePost

### Auth
- login
- signup

### Seed
- runSeed

---

## Postman Collection  

All endpoint examples are included in:
GraqhQl-workshop.postman_collection.json

