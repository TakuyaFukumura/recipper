// Mock Prisma client for development when Prisma binaries are not available
export interface PrismaRecipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  cookingTime: number | null;
  difficulty: string | null;
  category: string | null;
  tags: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateRecipeData {
  data: {
    title: string;
    description?: string;
    ingredients: string;
    instructions: string;
    cookingTime?: number;
    difficulty?: string;
    category?: string;
    tags?: string | null;
  };
}

interface UpdateRecipeData {
  where: { id: string };
  data: {
    title: string;
    description?: string;
    ingredients: string;
    instructions: string;
    cookingTime?: number;
    difficulty?: string;
    category?: string;
    tags?: string | null;
  };
}

interface DeleteRecipeData {
  where: { id: string };
}

interface FindUniqueData {
  where: { id: string };
}

interface FindManyOptions {
  orderBy?: {
    createdAt?: 'asc' | 'desc';
  };
}

interface MockPrismaClient {
  recipe: {
    findMany: (options?: FindManyOptions) => Promise<PrismaRecipe[]>;
    findUnique: (data: FindUniqueData) => Promise<PrismaRecipe | null>;
    create: (data: CreateRecipeData) => Promise<PrismaRecipe>;
    update: (data: UpdateRecipeData) => Promise<PrismaRecipe>;
    delete: (data: DeleteRecipeData) => Promise<PrismaRecipe>;
  };
}

// Fallback for when Prisma is not available
const createMockPrisma = (): MockPrismaClient => ({
  recipe: {
    findMany: async () => [] as PrismaRecipe[],
    findUnique: async () => null as PrismaRecipe | null,
    create: async (data: CreateRecipeData) => ({
      id: 'mock-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data.data,
    } as PrismaRecipe),
    update: async (data: UpdateRecipeData) => ({
      id: data.where.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data.data,
    } as PrismaRecipe),
    delete: async () => ({} as PrismaRecipe),
  },
});

let prismaClient: MockPrismaClient;

try {
  // Try to import Prisma client dynamically
  const PrismaClientModule = eval('require')('@prisma/client');
  const { PrismaClient } = PrismaClientModule;
  
  const globalForPrisma = globalThis as unknown as {
    prisma: MockPrismaClient | undefined;
  };

  prismaClient = globalForPrisma.prisma ?? new PrismaClient();

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
} catch {
  console.warn('Prisma client not available, using mock client');
  prismaClient = createMockPrisma();
}

export const prisma = prismaClient;