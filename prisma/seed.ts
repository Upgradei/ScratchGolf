import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaClient } from "../app/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const drills = [
  // Driver
  {
    name: "Fairway Finder",
    skillArea: "DRIVER" as const,
    description: "Build consistency hitting the driver into a target fairway.",
    instructions:
      "Pick a fairway (or a ~30-yard-wide target zone on the range). Hit 10 drives. Count how many finish in the zone, regardless of distance.",
    scoreLabel: "fairways hit / 10",
  },
  {
    name: "Start Line Control",
    skillArea: "DRIVER" as const,
    description: "Groove a repeatable start line for your tee shots.",
    instructions:
      "Set up two alignment sticks a few feet in front of the ball, about 5 yards apart, forming a gate on your intended line. Hit 10 drives. Count how many start through the gate.",
    scoreLabel: "shots on line / 10",
  },
  {
    name: "Three-Ball Elimination",
    skillArea: "DRIVER" as const,
    description: "Simulate on-course pressure by requiring consecutive good shots.",
    instructions:
      "Hit 3 drives in a row. All 3 must finish in your fairway zone to count as a clean set. Repeat for 5 sets.",
    scoreLabel: "clean sets / 5",
  },

  // Approach
  {
    name: "Distance Control Ladder",
    skillArea: "APPROACH" as const,
    description: "Dial in proximity to the pin across a range of approach distances.",
    instructions:
      "Pick 3 distances (e.g. 100, 125, 150 yards). Hit 3 balls to each. Score each shot: inside 10ft = 3pts, 10-20ft = 2pts, 20-30ft = 1pt, outside = 0pts. Sum the total.",
    scoreLabel: "total points / 27",
  },
  {
    name: "Circle Drill",
    skillArea: "APPROACH" as const,
    description: "Test proximity consistency from a single approach distance.",
    instructions:
      "From 120 yards, hit 10 approach shots. Count how many finish inside an imaginary 20-foot circle around the flag.",
    scoreLabel: "shots inside 20ft / 10",
  },
  {
    name: "Random Yardage Precision",
    skillArea: "APPROACH" as const,
    description: "Practice adjusting to unpredictable yardages, like you'll face on course.",
    instructions:
      "Pick 5 random distances between 80-160 yards (e.g. using a random number generator). Hit one shot to each. Estimate and record your distance from the pin in feet for each, then average them.",
    scoreLabel: "avg distance from pin in feet (lower is better)",
  },

  // Chipping
  {
    name: "Up-and-Down Challenge",
    skillArea: "CHIPPING" as const,
    description: "Practice the full short-game sequence: chip plus a putt to finish.",
    instructions:
      "Drop balls in 10 different spots around the green, within 30 yards. From each, chip and then putt out. Count how many you get up-and-down in 2 total strokes.",
    scoreLabel: "up-and-downs / 10",
  },
  {
    name: "Landing Spot Precision",
    skillArea: "CHIPPING" as const,
    description: "Train precise landing-spot control, the foundation of consistent chipping.",
    instructions:
      "Pick a landing spot partway to the hole (about a 3-foot-diameter target). Hit 10 chips. Count how many land within that spot.",
    scoreLabel: "chips on landing spot / 10",
  },
  {
    name: "3-Foot Circle Chipping",
    skillArea: "CHIPPING" as const,
    description: "Measure your chipping proximity to the hole from a consistent lie.",
    instructions:
      "From the same 15-20 yard lie, hit 10 chips. Count how many finish within 3 feet of the hole.",
    scoreLabel: "chips inside 3ft / 10",
  },

  // Putting
  {
    name: "Gate Drill",
    skillArea: "PUTTING" as const,
    description: "Groove a square putter face and start line on short putts.",
    instructions:
      "Set up a gate slightly wider than your putter head, about 6 inches in front of the ball, on a straight 6-foot putt. Hit 10 putts. Count how many roll through the gate without touching it.",
    scoreLabel: "putts through gate / 10",
  },
  {
    name: "3-6-9 Ladder",
    skillArea: "PUTTING" as const,
    description: "Build confidence across the most common putt lengths.",
    instructions:
      "Putt 5 balls each from 3, 6, and 9 feet (15 putts total). Count total makes.",
    scoreLabel: "makes / 15",
  },
  {
    name: "Lag Putting Circle",
    skillArea: "PUTTING" as const,
    description: "Improve distance control on long putts to avoid 3-putts.",
    instructions:
      "From 30+ feet, hit 10 lag putts. Count how many finish within a 3-foot circle of the hole.",
    scoreLabel: "lag putts inside 3ft / 10",
  },
  {
    name: "The Clock Drill",
    skillArea: "PUTTING" as const,
    description: "Pressure-test short putts from all angles around the hole.",
    instructions:
      "Place 8 balls in a clock pattern around the hole, each 4 feet away. Putt all 8. Count makes.",
    scoreLabel: "makes / 8",
  },
];

async function main() {
  for (const drill of drills) {
    const existing = await prisma.drill.findFirst({
      where: { name: drill.name },
    });
    if (existing) {
      await prisma.drill.update({ where: { id: existing.id }, data: drill });
    } else {
      await prisma.drill.create({ data: drill });
    }
  }
  console.log(`Seeded ${drills.length} drills.`);
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
