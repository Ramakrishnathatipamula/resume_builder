import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function runPhase2Verification() {
  console.log("=== CAREERFORGE PHASE 2 VERIFICATION ===");
  console.log("1. Testing Career Profile CRUD & Persistence in Neon PostgreSQL...");

  try {
    const testEmail = `test_profile_${Date.now()}@careerforge.test`;
    const user = await db.user.create({
      data: {
        name: "Test Profile Engineer",
        email: testEmail,
      },
    });
    console.log(`✓ Created test user: ${user.name} (${user.id})`);

    // Create Profile
    const profile = await db.profile.create({
      data: {
        userId: user.id,
        fullName: "Test Profile Engineer",
        headline: "Principal Cloud Architect",
        summary: "10+ years specializing in distributed systems and cloud native architectures.",
        email: testEmail,
        phone: "+1-555-0199",
        location: "Seattle, WA",
        githubUrl: "https://github.com/testengineer",
        linkedinUrl: "https://linkedin.com/in/testengineer",
        targetRoles: ["Principal Cloud Architect", "Staff Systems Engineer"],
        completionScore: 0,
      },
    });
    console.log(`✓ Created Profile record: ${profile.id}`);

    // Add Education
    const edu = await db.education.create({
      data: {
        profileId: profile.id,
        institution: "University of Washington",
        degree: "M.S.",
        fieldOfStudy: "Computer Science",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2020-06-01"),
        isCurrent: false,
        gpa: "3.95",
      },
    });
    console.log(`✓ Created Education: ${edu.degree} at ${edu.institution}`);

    // Add Work Experience
    const exp = await db.experience.create({
      data: {
        profileId: profile.id,
        company: "Apex Cloud Systems",
        title: "Senior Distributed Systems Engineer",
        location: "Remote",
        startDate: new Date("2020-07-01"),
        isCurrent: true,
        bullets: [
          "Architected real-time streaming data pipeline processing 50k events/sec.",
          "Reduced cloud infrastructure costs by 32% via autoscaling policies.",
        ],
        technologies: ["Go", "Kubernetes", "PostgreSQL", "Kafka"],
      },
    });
    console.log(`✓ Created Experience: ${exp.title} at ${exp.company}`);

    // Add Skills
    const skill1 = await db.skill.create({
      data: { profileId: profile.id, name: "Go", category: "TECHNICAL", level: "Expert" },
    });
    const skill2 = await db.skill.create({
      data: { profileId: profile.id, name: "Kubernetes", category: "TOOL", level: "Advanced" },
    });
    const skill3 = await db.skill.create({
      data: { profileId: profile.id, name: "PostgreSQL", category: "TECHNICAL", level: "Expert" },
    });
    console.log(`✓ Created 3 Skills: ${skill1.name}, ${skill2.name}, ${skill3.name}`);

    // Add Project
    const proj = await db.project.create({
      data: {
        profileId: profile.id,
        name: "Raft Consensus Cluster",
        role: "Sole Creator",
        description: "Implementation of the Raft distributed consensus protocol.",
        demoUrl: "https://raft-demo.dev",
        repoUrl: "https://github.com/testengineer/raft-cluster",
        bullets: ["Built leader election and log replication with zero data divergence."],
        technologies: ["Go", "gRPC", "Protobuf"],
      },
    });
    console.log(`✓ Created Project: ${proj.name}`);

    // Add Certification
    const cert = await db.certification.create({
      data: {
        profileId: profile.id,
        name: "AWS Certified Solutions Architect - Professional",
        issuer: "Amazon Web Services",
        issueDate: new Date("2023-04-15"),
        credentialId: "AWS-PSA-99412",
      },
    });
    console.log(`✓ Created Certification: ${cert.name}`);

    // Verify Read with all relations
    console.log("\n2. Verifying Relational Persistence & Query Integrity...");
    const fullProfile = await db.profile.findUnique({
      where: { id: profile.id },
      include: {
        educations: true,
        experiences: true,
        skills: true,
        projects: true,
        certifications: true,
      },
    });

    if (
      fullProfile &&
      fullProfile.educations.length === 1 &&
      fullProfile.experiences.length === 1 &&
      fullProfile.skills.length === 3 &&
      fullProfile.projects.length === 1 &&
      fullProfile.certifications.length === 1
    ) {
      console.log("✓ Relational Persistence PASS: All 5 profile relations verified in Neon DB.");
    } else {
      console.error("❌ Relational Persistence FAIL!");
      process.exit(1);
    }

    // Clean up
    console.log("\n3. Cleaning up test records...");
    await db.user.delete({ where: { id: user.id } });
    console.log("✓ Test records cleaned up successfully.");

    console.log("\n=== ALL PHASE 2 CRITERIA PASSED SUCCESSFULLY ===");
  } catch (err) {
    console.error("Phase 2 verification error:", err);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runPhase2Verification();
