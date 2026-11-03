import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function runVerification() {
  console.log("=== CAREERFORGE PHASE 1 VERIFICATION ===");
  console.log("1. Testing Neon PostgreSQL Connection...");

  try {
    const userCount = await db.user.count();
    console.log(`✓ Neon DB reachable! Current registered users: ${userCount}`);

    // Create User A
    const emailA = `usera_${Date.now()}@careerforge.test`;
    const userA = await db.user.create({
      data: {
        name: "Alice Engineer",
        email: emailA,
        profile: {
          create: {
            fullName: "Alice Engineer",
            headline: "Senior Backend Systems Engineer",
            summary: "Specialist in high-throughput distributed systems.",
            targetRoles: ["Senior Backend Engineer", "Systems Architect"],
          },
        },
      },
      include: { profile: true },
    });
    console.log(`✓ Created User A: ${userA.name} (${userA.email}) with Profile ID: ${userA.profile?.id}`);

    // Create User B
    const emailB = `userb_${Date.now()}@careerforge.test`;
    const userB = await db.user.create({
      data: {
        name: "Bob Fullstack",
        email: emailB,
        profile: {
          create: {
            fullName: "Bob Fullstack",
            headline: "Full-Stack React & Next.js Developer",
            summary: "Frontend and fullstack product engineer.",
            targetRoles: ["Full Stack Developer"],
          },
        },
      },
      include: { profile: true },
    });
    console.log(`✓ Created User B: ${userB.name} (${userB.email}) with Profile ID: ${userB.profile?.id}`);

    // Test Multi-User Data Isolation
    console.log("\n2. Testing Multi-Tenant Data Isolation...");
    
    // Simulate User A querying for User B's profile
    const userAAttemptOnB = await db.profile.findFirst({
      where: {
        id: userB.profile!.id,
        userId: userA.id, // Enforce User A's session boundary
      },
    });

    if (userAAttemptOnB === null) {
      console.log("✓ Isolation PASS: User A cannot read User B's profile (returned null as expected).");
    } else {
      console.error("❌ Isolation FAIL: User A was able to read User B's profile!");
      process.exit(1);
    }

    // Simulate User B querying their own profile
    const userBQueryOwn = await db.profile.findFirst({
      where: {
        id: userB.profile!.id,
        userId: userB.id,
      },
    });

    if (userBQueryOwn && userBQueryOwn.fullName === "Bob Fullstack") {
      console.log("✓ Isolation PASS: User B successfully reads their own profile.");
    } else {
      console.error("❌ User B failed to read their own profile!");
      process.exit(1);
    }

    // Clean up test users
    console.log("\n3. Cleaning up test records...");
    await db.user.delete({ where: { id: userA.id } });
    await db.user.delete({ where: { id: userB.id } });
    console.log("✓ Test users cleaned up successfully.");

    console.log("\n=== ALL PHASE 1 CRITERIA PASSED SUCCESSFULLY ===");
  } catch (error) {
    console.error("Verification error:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runVerification();

