"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const roles = ['MEMBER', 'MANAGER', 'ADMIN'];
    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { roleName },
            update: {},
            create: {
                roleName,
                description: `System role: ${roleName}`,
            },
        });
    }
    console.log('✅ Roles seeded');
    const countries = [
        { countryName: 'United States', isoCode: 'US', currencyCode: 'USD' },
        { countryName: 'Canada', isoCode: 'CA', currencyCode: 'CAD' },
        { countryName: 'United Kingdom', isoCode: 'GB', currencyCode: 'GBP' },
        { countryName: 'India', isoCode: 'IN', currencyCode: 'INR' },
    ];
    for (const country of countries) {
        await prisma.country.upsert({
            where: { isoCode: country.isoCode },
            update: {},
            create: country,
        });
    }
    console.log('✅ Countries seeded');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map