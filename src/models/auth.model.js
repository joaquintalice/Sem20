import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default class AuthModel {

    async insert({ email, password }) {
        return await prisma.users.create({ data: { email, password } });
    }

    async getAll() {
        return await prisma.users.findMany();
    }

    async getByEmail(email) {
        return await prisma.users.findUnique({ where: { email: email } });
    }

    async getById(id) {
        return await prisma.users.findUnique({ where: { id: id } });
    }

    async update(id, body) {
        return await prisma.users.update({ where: { id, }, data: body });
    }

    async remove(id) {
        return await prisma.users.delete({ where: { id } });
    }
}