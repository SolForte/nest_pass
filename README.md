# Nest Pass
Nest Pass is a password management application.

## About
This project is a web API. You register as a user and save credentials, notes and credit card information. Implemented features are:
<ul>
<li>Sign Up;</li>
<li>Sign In;</li>
<li>Create/Read/Delete Credentials;</li>
<li>Create/Read/Delete Notes;</li>
<li>Create/Read/Delete Cards;</li>
<li>Delete User Account.</li>
</ul>

## Technologies
The following dependencies and technologies were used in this project:

![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![nest](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)
![jwt](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
![node](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![postgresql](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)


## How to run
1. Clone this repository
2. Install Dependencies
```bash
npm install
```

3. Run the app with
```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

4. Run the tests with
```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
OBS: It might be necessary modifying the enviroment variable values on `/.env.test` or creating a `/.env` file with the `DATABASE_URL`, `JWT_SECRET` and `SECRET` enviroment variables.
