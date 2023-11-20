import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export class FileModel {

    async insert({ img, url, userId }) {
        return await prisma.files.create({ data: { img, url, userId } });
    }

    async getAll() {
        return await prisma.files.findMany();
    }

    async getById(id) {
        return await prisma.files.findUnique({ where: { id: id } });
    }

    async update(id, body) {
        return await prisma.files.update({ where: { id, }, data: body });
    }

    async remove(id) {
        return await prisma.files.delete({ where: { id } });
    }
}

export class PrivateFileModel {

    async insert({ img, userId, url }) {
        return await prisma.privateFiles.create({ data: { img, userId, url } });
    }

    async getAllByUser(id) {
        return await prisma.privateFiles.findMany({ where: { userId: id } });
    }

    async getById(id) {
        return await prisma.privateFiles.findUnique({ where: { id: id } });
    }

    async update(id, body) {
        return await prisma.privateFiles.update({ where: { id, }, data: body });
    }

    async remove(id) {
        return await prisma.privateFiles.delete({ where: { id } });
    }
}