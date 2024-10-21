import { PrismaClient } from "@prisma/client";
const prisma= new PrismaClient();

const departments=[
    { name: 'Computer Science' },
    { name: 'Electronics and Communication Engineering' },
    { name: 'Electrical and elactronics' },
    { name: 'Bio Technology' },
    {name:'Cyber Security'}
]

async function main(){
    for (const dept of departments) {
        await prisma.departments.create({
          data: dept,
        });
      }

}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });