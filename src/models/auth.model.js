import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default class AuthModel {

    async insert({ email, password }) {
        return await prisma.user.create({ data: { email, password } });
    }

    async getAll() {
        return await prisma.user.findMany({ include: { files: true, privateFile: true } });
    }

    async getByEmail(email) {
        return await prisma.user.findUnique({ where: { email: email } });
    }

    async getById(id) {
        return await prisma.user.findUnique({ where: { id: id } });
    }

    async update(id, body) {
        return await prisma.user.update({ where: { id, }, data: body });
    }

    async remove(id) {
        return await prisma.user.delete({ where: { id } });
    }
}