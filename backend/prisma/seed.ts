
import { faker } from '@faker-js/faker';
import { PrismaClient, ProductCondition, ReturnPolicy, ShippingOption, UserRole, WarrantyType } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@g1g2.com',
      password,
      role: UserRole.ADMIN,
      cart: {
        create: {},
      },
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'User',
      email: 'user@g1g2.com',
      password,
      role: UserRole.USER,
      cart: {
        create: {},
      },
    },
  });

  for (let i = 0; i < 20; i++) {
    await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(),
        stock: faker.number.int({ min: 0, max: 100 }),
        withoutDiscount: +faker.commerce.price(),
        discountPercentage: faker.number.int({ min: 0, max: 100 }),
        rating: faker.number.float({ min: 0, max: 5 }),
        inStock: faker.datatype.boolean(),
        isNew: faker.datatype.boolean(),
        condition: faker.helpers.arrayElement(Object.values(ProductCondition)),
        categorys: [faker.commerce.department(), faker.commerce.department()],
        specifications: [
          { name: 'Weight', value: `${faker.number.int({ min: 1, max: 100 })}g` },
          { name: 'Dimensions', value: `${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}cm` },
        ],
        mainFeatures: [
            { name: 'Feature 1', value: faker.lorem.sentence() },
            { name: 'Feature 2', value: faker.lorem.sentence() },
        ],
        colors: [faker.color.human(), faker.color.human()],
        includes: [faker.lorem.word(), faker.lorem.word()],
        freeShipping: faker.helpers.arrayElement(Object.values(ShippingOption)),
        warranty: faker.helpers.arrayElement(Object.values(WarrantyType)),
        returnPolicy: faker.helpers.arrayElement(Object.values(ReturnPolicy)),
        userId: faker.helpers.arrayElement([admin.id, user.id]),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
