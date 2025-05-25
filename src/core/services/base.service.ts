import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class BaseService<
  T,
  CreateDTO,
  UpdateDTO,
  M extends Prisma.ModelName = any,
> {
  constructor(
    private readonly prismaModel: any,
    private readonly modelName: M,
  ) {}

  /**
   * Creates a new entity
   * @example
   * -- Create a new user
   * const newUser = await userService.create({
   *   email: 'john@example.com',
   *   name: 'John Doe',
   *   role: 'USER'
   * });
   * @param createDto - The data to create the entity
   * @throws {BadRequestException} When unique constraint is violated
   * @returns Promise with the created entity
   */
  async create(createDto: CreateDTO): Promise<T> {
    try {
      return await this.prismaModel.create({
        data: createDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Unique constraint violation');
        }
      }
      throw error;
    }
  }

  /**
   * Finds all entities that match the specified criteria
   * @example
   * -- Find all active users
   * const activeUsers = await userService.findAllBy({ status: 'active' });
   *
   * -- Find users with relations and sorting
   * const usersWithPosts = await userService.findAllBy(
   *   { role: 'AUTHOR' },
   *   { include: { posts: true }, orderBy: { createdAt: 'desc' } }
   * );
   * @param where - The conditions to filter entities
   * @param options - Additional options like include, select, orderBy, etc.
   * @returns Promise with array of matching entities
   */
  async findAllBy(
    where: Prisma.Args<M, 'findMany'>['where'],
    options?: Omit<Prisma.Args<M, 'findMany'>, 'where'>,
  ): Promise<T[]> {
    return this.prismaModel.findMany({
      where,
      ...options,
    });
  }

  /**
   * Finds a single entity by specified criteria
   * @example
   * -- Find user by email
   * const user = await userService.findOneBy({ email: 'john@example.com' });
   *
   * -- Find user with relations
   * const userWithProfile = await userService.findOneBy(
   *   { email: 'john@example.com' },
   *   { include: { profile: true } }
   * );
   * @param where - The conditions to find the entity
   * @param options - Additional options like include, select, etc.
   * @returns Promise with the found entity or null
   */
  async findOneBy(
    where: Prisma.Args<M, 'findUnique'>['where'],
    options?: Omit<Prisma.Args<M, 'findUnique'>, 'where'>,
  ): Promise<T> {
    return this.prismaModel.findUnique({
      where,
      ...options,
    });
  }

  /**
   * Finds a single entity by specified criteria or throws an error
   * @example
   * -- Find user by email or throw error
   * const user = await userService.findOneByOrFail({ email: 'john@example.com' });
   *
   * -- Find user with relations or throw error
   * const userWithProfile = await userService.findOneByOrFail(
   *   { email: 'john@example.com' },
   *   { include: { profile: true } }
   * );
   * @param where - The conditions to find the entity
   * @param options - Additional options like include, select, etc.
   * @throws {NotFoundException} When entity is not found
   * @returns Promise with the found entity
   */
  async findOneByOrFail(
    where: Prisma.Args<M, 'findUnique'>['where'],
    options?: Omit<Prisma.Args<M, 'findUnique'>, 'where'>,
  ): Promise<T> {
    const entity = await this.prismaModel.findUnique({
      where,
      ...options,
    });
    if (!entity) {
      throw new NotFoundException(`${this.modelName} not found`);
    }
    return entity;
  }

  /**
   * Retrieves all entities
   * @example
   * -- Get all users
   * const allUsers = await userService.findAll();
   *
   * -- Get all users with their posts
   * const usersWithPosts = await userService.findAll({
   *   include: { posts: true },
   *   orderBy: { createdAt: 'desc' }
   * });
   * @param options - Query options like include, select, where, etc.
   * @returns Promise with array of all entities
   */
  async findAll(options?: Prisma.Args<M, 'findMany'>): Promise<T[]> {
    return this.prismaModel.findMany(options);
  }

  async findOne(
    id: string | number,
    options?: Prisma.Args<M, 'findUnique'>,
  ): Promise<T> {
    return this.prismaModel.findUnique({
      where: { id },
      ...options,
    });
  }

  /**
   * Finds a single entity by id
   * @example
   * -- Find user by id
   * const user = await userService.findOne(1);
   *
   * -- Find user with related data
   * const userWithPosts = await userService.findOne(1, {
   *   include: { posts: true, profile: true }
   * });
   * @param id - The entity identifier
   * @param options - Query options like include, select, etc.
   * @throws {NotFoundException} When entity is not found
   * @returns Promise with the found entity
   */
  async findOneOrFail(
    id: string | number,
    options?: Prisma.Args<M, 'findUnique'>,
  ): Promise<T> {
    const entity = await this.prismaModel.findUnique({
      where: { id },
      ...options,
    });
    if (!entity) {
      throw new NotFoundException(`${this.modelName} not found`);
    }
    return entity;
  }

  /**
   * Updates an entity by id
   * @example
   * -- Update user's name
   * const updatedUser = await userService.update(1, { name: 'New Name' });
   *
   * -- Update user and return with posts
   * const updatedWithPosts = await userService.update(
   *   1,
   *   { status: 'ACTIVE' },
   *   { include: { posts: true } }
   * );
   * @param id - The entity identifier
   * @param updateDto - The data to update
   * @param options - Query options like include, select, etc.
   * @throws {NotFoundException} When entity is not found
   * @returns Promise with the updated entity
   */
  async update(
    id: string | number,
    updateDto: UpdateDTO,
    options?: Prisma.Args<M, 'update'>,
  ): Promise<T> {
    await this.findOneOrFail(id);
    return await this.prismaModel.update({
      where: { id },
      data: updateDto,
      ...options,
    });
  }

  /**
   * Removes an entity by id
   * @example
   * -- Delete a user
   * const deletedUser = await userService.remove(1);
   *
   * -- Delete user and return with related data
   * const deletedWithPosts = await userService.remove(1, {
   *   include: { posts: true }
   * });
   * @param id - The entity identifier
   * @param options - Query options like include, select, etc.
   * @throws {NotFoundException} When entity is not found
   * @returns Promise with the deleted entity
   */
  async remove(
    id: string | number,
    options?: Prisma.Args<M, 'delete'>,
  ): Promise<T> {
    await this.findOneOrFail(id);
    return await this.prismaModel.delete({
      where: { id },
      ...options,
    });
  }
}
