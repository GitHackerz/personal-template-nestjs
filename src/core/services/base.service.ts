import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class BaseService<
    T,
    CreateDTO,
    UpdateDTO,
    M extends Prisma.ModelName = any
> {
    constructor(
        private readonly prismaModel: any,
        private readonly modelName: M
    ) {}

    async create(createDto: CreateDTO): Promise<T> {
        return this.prismaModel.create({
            data: createDto
        });
    }

    async findAll(): Promise<T[]> {
        return this.prismaModel.findMany();
    }

    async findOne(id: string | number): Promise<T> {
        const entity = await this.prismaModel.findUnique({
            where: { id }
        });
        if (!entity) {
            throw new NotFoundException(`${this.modelName}  not found`);
        }
        return entity;
    }

    async findOneOrFail(id: string | number): Promise<T> {
        const entity = await this.findOne(id);
        if (!entity) {
            throw new NotFoundException(`${this.modelName}  not found`);
        }
        return entity;
    }

    async update(id: string | number, updateDto: UpdateDTO): Promise<T> {
        try {
            return await this.prismaModel.update({
                where: { id },
                data: updateDto
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException(`${this.modelName}  not found`);
            }
            throw error;
        }
    }

    async remove(id: string | number): Promise<T> {
        try {
            return await this.prismaModel.delete({
                where: { id }
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException(`${this.modelName}  not found`);
            }
            throw error;
        }
    }
}
