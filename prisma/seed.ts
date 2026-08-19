import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaClient } from "../app/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SkillArea = "DRIVER" | "APPROACH" | "CHIPPING" | "PUTTING";
type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

const drills: {
  name: string;
  skillArea: SkillArea;
  difficultyLevel: DifficultyLevel;
  description: string;
  instructions: string;
  scoreLabel: string;
  benchmarkNote?: string;
}[] = [
  // ---------- DRIVER ----------
  {
    name: "Tee Height Consistency",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    description: "Build a repeatable tee height and check strike location.",
    instructions:
      "Tee the ball so half of it is above the driver's crown at address. Use foot spray or impact tape on the face. Hit 10 drives and count how many strike within the center 'sweet zone' of the face.",
    scoreLabel: "sweet-zone strikes / 10",
    benchmarkNote: "Scratch golfers strike the sweet zone on 8-9 of 10 drives.",
  },
  {
    name: "Fairway Finder",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    description: "Build consistency hitting the driver into a target fairway.",
    instructions:
      "Pick a fairway (or a ~30-yard-wide target zone on the range). Hit 10 drives. Count how many finish in the zone, regardless of distance.",
    scoreLabel: "fairways hit / 10",
    benchmarkNote: "Scratch golfers hit 6-7 of 10 fairways of this width.",
  },
  {
    name: "Alignment Check",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    description: "Verify pre-shot alignment is correct before every swing.",
    instructions:
      "Set two alignment sticks on the ground: one on the target line, one on your foot line. Before each of 10 drives, check your setup against both sticks. Count how many setups were correctly aligned before you swung.",
    scoreLabel: "correct alignments / 10",
  },
  {
    name: "Start Line Control",
    skillArea: "DRIVER",
    difficultyLevel: "INTERMEDIATE",
    description: "Groove a repeatable start line for your tee shots.",
    instructions:
      "Set up two alignment sticks a few feet in front of the ball, about 5 yards apart, forming a gate on your intended line. Hit 10 drives. Count how many start through the gate.",
    scoreLabel: "shots on line / 10",
    benchmarkNote: "Scratch golfers start 7+ of 10 shots on their intended line.",
  },
  {
    name: "Draw/Fade on Command",
    skillArea: "DRIVER",
    difficultyLevel: "INTERMEDIATE",
    description: "Control shot shape deliberately instead of playing one shape.",
    instructions:
      "Hit 5 drives trying to curve the ball left-to-right (fade) and 5 trying to curve it right-to-left (draw), alternating. Count how many curved in the intended direction, regardless of how much.",
    scoreLabel: "shots curved as intended / 10",
    benchmarkNote: "Scratch golfers control shot shape on command 7+ times out of 10.",
  },
  {
    name: "Tempo Ladder",
    skillArea: "DRIVER",
    difficultyLevel: "INTERMEDIATE",
    description: "Find your most reliable swing tempo under varying effort.",
    instructions:
      "Hit 3 drives each at a slow, normal, and aggressive swing tempo (9 total). After each shot, rate strike quality 1-5 (1 = poor contact, 5 = flush). Average all 9 ratings.",
    scoreLabel: "avg strike quality (1-5, higher is better)",
  },
  {
    name: "Three-Ball Elimination",
    skillArea: "DRIVER",
    difficultyLevel: "ADVANCED",
    description: "Simulate on-course pressure by requiring consecutive good shots.",
    instructions:
      "Hit 3 drives in a row. All 3 must finish in your fairway zone to count as a clean set. Repeat for 5 sets.",
    scoreLabel: "clean sets / 5",
    benchmarkNote: "Scratch golfers complete 3-4 of 5 clean sets.",
  },
  {
    name: "Fairway Under Pressure",
    skillArea: "DRIVER",
    difficultyLevel: "ADVANCED",
    description: "One shot, one chance, like a real tee shot on the course.",
    instructions:
      "Simulate 10 individual tee shots, one ball each, no do-overs, at a tight ~20-yard-wide fairway target. Count how many you hit.",
    scoreLabel: "tight fairways hit / 10",
    benchmarkNote: "Scratch golfers hit roughly 6-7 of 10 tight fairways under this format.",
  },
  {
    name: "Launch Optimization",
    skillArea: "DRIVER",
    difficultyLevel: "ADVANCED",
    description: "Train a penetrating, efficient ball flight rather than a high, spinny one.",
    instructions:
      "Hit 10 drives focused on a low-spin, penetrating flight (not ballooning). Rate each shot's flight quality 1-5 by eye. Average across all 10.",
    scoreLabel: "avg flight quality (1-5, higher is better)",
  },

  // ---------- APPROACH ----------
  {
    name: "Solid Strike Check",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description: "Confirm center-face contact before worrying about targets.",
    instructions:
      "Using foot spray or a strike-detection mat, hit 10 approach shots with a mid-iron. Count how many are center-face strikes.",
    scoreLabel: "center strikes / 10",
    benchmarkNote: "Scratch golfers strike center-face on 8-9 of 10 iron shots.",
  },
  {
    name: "Club Selection Confidence",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description: "Build trust in your natural club/yardage pairing.",
    instructions:
      "Hit to 5 different random approach yardages, picking the club you'd naturally choose each time. Before each shot, rate your confidence 1-5. Average your confidence ratings.",
    scoreLabel: "avg pre-shot confidence (1-5)",
  },
  {
    name: "Distance Control Ladder",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description: "Dial in proximity to the pin across a range of approach distances.",
    instructions:
      "Pick 3 distances (e.g. 100, 125, 150 yards). Hit 3 balls to each. Score each shot: inside 10ft = 3pts, 10-20ft = 2pts, 20-30ft = 1pt, outside = 0pts. Sum the total.",
    scoreLabel: "total points / 27",
    benchmarkNote: "Scratch golfers typically score 18-22 of 27 points.",
  },
  {
    name: "Circle Drill",
    skillArea: "APPROACH",
    difficultyLevel: "INTERMEDIATE",
    description: "Test proximity consistency from a single approach distance.",
    instructions:
      "From 120 yards, hit 10 approach shots. Count how many finish inside an imaginary 20-foot circle around the flag.",
    scoreLabel: "shots inside 20ft / 10",
    benchmarkNote: "Scratch golfers land 6-7 of 10 inside a 20ft circle from this range.",
  },
  {
    name: "Trajectory Control",
    skillArea: "APPROACH",
    difficultyLevel: "INTERMEDIATE",
    description: "Control ball flight height to handle wind and pin positions.",
    instructions:
      "To the same target, hit 3 shots at a deliberately low trajectory, 3 at medium, and 3 at high (9 total). Rate how well each matched the intended flight 1-5. Average all 9.",
    scoreLabel: "avg trajectory match (1-5, higher is better)",
  },
  {
    name: "Random Yardage Precision",
    skillArea: "APPROACH",
    difficultyLevel: "INTERMEDIATE",
    description: "Practice adjusting to unpredictable yardages, like you'll face on course.",
    instructions:
      "Pick 5 random distances between 80-160 yards (e.g. using a random number generator). Hit one shot to each. Estimate and record your distance from the pin in feet for each, then average them.",
    scoreLabel: "avg distance from pin in feet (lower is better)",
    benchmarkNote: "Scratch golfers average roughly 25-35 feet from the pin across varied yardages.",
  },
  {
    name: "Pin-High Precision",
    skillArea: "APPROACH",
    difficultyLevel: "ADVANCED",
    description: "Isolate distance control by ignoring left-right entirely.",
    instructions:
      "From 100-150 yards, hit 10 shots focused purely on distance (front-to-back), ignoring left-right dispersion. Count how many finish pin-high within 10 feet (front or back).",
    scoreLabel: "pin-high shots / 10",
    benchmarkNote: "Scratch golfers finish pin-high within 10ft on roughly 6 of 10 shots.",
  },
  {
    name: "Approach Under Pressure",
    skillArea: "APPROACH",
    difficultyLevel: "ADVANCED",
    description: "One shot per hole, like real approach shots on the course.",
    instructions:
      "Simulate 10 individual approach shots from varying distances, one ball each. Each shot must finish inside a 15-foot circle to 'pass'. Count passes.",
    scoreLabel: "passes / 10",
    benchmarkNote: "Scratch golfers pass on roughly 5-6 of 10 attempts.",
  },
  {
    name: "Wind/Trouble Management",
    skillArea: "APPROACH",
    difficultyLevel: "ADVANCED",
    description: "Practice playing away from trouble instead of always attacking the pin.",
    instructions:
      "Imagine a tucked pin guarded by a hazard on one side. Hit 10 approach shots aimed at the safe portion of the green, not the flag. Count how many finish on the safe side.",
    scoreLabel: "safe-side shots / 10",
  },

  // ---------- CHIPPING ----------
  {
    name: "Landing Spot Precision",
    skillArea: "CHIPPING",
    difficultyLevel: "BEGINNER",
    description: "Train precise landing-spot control, the foundation of consistent chipping.",
    instructions:
      "Pick a landing spot partway to the hole (about a 3-foot-diameter target). Hit 10 chips. Count how many land within that spot.",
    scoreLabel: "chips on landing spot / 10",
    benchmarkNote: "Scratch golfers land 7+ of 10 chips on their intended spot.",
  },
  {
    name: "Up-and-Down Challenge",
    skillArea: "CHIPPING",
    difficultyLevel: "BEGINNER",
    description: "Practice the full short-game sequence: chip plus a putt to finish.",
    instructions:
      "Drop balls in 10 different spots around the green, within 30 yards. From each, chip and then putt out. Count how many you get up-and-down in 2 total strokes.",
    scoreLabel: "up-and-downs / 10",
    benchmarkNote: "Scratch golfers get up-and-down roughly 5-6 of 10 times.",
  },
  {
    name: "Club Selection for Lies",
    skillArea: "CHIPPING",
    difficultyLevel: "BEGINNER",
    description: "Match technique and club to the lie you're actually facing.",
    instructions:
      "Practice from 3 different lie types (clean fairway, light rough, tight/bare) using the appropriate chip technique for each. Self-rate execution quality 1-5 per lie. Average the 3 ratings.",
    scoreLabel: "avg execution quality (1-5, higher is better)",
  },
  {
    name: "3-Foot Circle Chipping",
    skillArea: "CHIPPING",
    difficultyLevel: "INTERMEDIATE",
    description: "Measure your chipping proximity to the hole from a consistent lie.",
    instructions:
      "From the same 15-20 yard lie, hit 10 chips. Count how many finish within 3 feet of the hole.",
    scoreLabel: "chips inside 3ft / 10",
    benchmarkNote: "Scratch golfers finish inside 3ft on roughly 5-6 of 10 chips.",
  },
  {
    name: "Bump-and-Run vs Lofted Choice",
    skillArea: "CHIPPING",
    difficultyLevel: "INTERMEDIATE",
    description: "Build decision-making between low-running and high-lofted chips.",
    instructions:
      "For 10 varied chips around the green, choose and execute whichever shot type fits (bump-and-run or lofted). Self-rate decision quality plus execution 1-5 for each. Average all 10.",
    scoreLabel: "avg decision + execution score (1-5)",
  },
  {
    name: "Uphill/Downhill Lies",
    skillArea: "CHIPPING",
    difficultyLevel: "INTERMEDIATE",
    description: "Handle the lie adjustments uphill and downhill chips require.",
    instructions:
      "Hit 10 chips split evenly between uphill and downhill lies. Count how many finish within 6 feet of the hole.",
    scoreLabel: "chips inside 6ft / 10",
  },
  {
    name: "Tight Lie Precision",
    skillArea: "CHIPPING",
    difficultyLevel: "ADVANCED",
    description: "The hardest common chipping lie — thin margin for error.",
    instructions:
      "From a very tight fairway or bare lie, hit 10 chips. Count clean strikes (no chunks or thins) that also land on your intended target spot.",
    scoreLabel: "clean strikes on target / 10",
    benchmarkNote: "Scratch golfers execute cleanly from tight lies on roughly 6-7 of 10 attempts.",
  },
  {
    name: "Championship Up-and-Down Test",
    skillArea: "CHIPPING",
    difficultyLevel: "ADVANCED",
    description: "Up-and-down practice from the toughest greenside spots.",
    instructions:
      "From 10 difficult greenside spots (tight lies, awkward stances, longer chips), chip and putt out. Count how many you get up-and-down in 2 total strokes.",
    scoreLabel: "up-and-downs / 10",
    benchmarkNote: "Scratch golfers convert roughly 4-5 of 10 from tough spots.",
  },
  {
    name: "Scrambling Simulation",
    skillArea: "CHIPPING",
    difficultyLevel: "ADVANCED",
    description: "Simulate a full round's worth of missed greens.",
    instructions:
      "Simulate 9 'missed green' scenarios with varying lies and distances, as if playing 9 holes. For each, try to save par (get up-and-down). Count successful scrambles.",
    scoreLabel: "scrambles / 9",
    benchmarkNote: "Scratch golfers scramble (save par) roughly 50-60% of the time.",
  },

  // ---------- PUTTING ----------
  {
    name: "Gate Drill",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    description: "Groove a square putter face and start line on short putts.",
    instructions:
      "Set up a gate slightly wider than your putter head, about 6 inches in front of the ball, on a straight 6-foot putt. Hit 10 putts. Count how many roll through the gate without touching it.",
    scoreLabel: "putts through gate / 10",
    benchmarkNote: "Scratch golfers pass the gate on 8-9 of 10 putts.",
  },
  {
    name: "Straight Putt Repeater",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    description: "Build a repeatable stroke on the simplest possible putt.",
    instructions:
      "From 4 feet on a straight, flat putt, hit 10 putts. Count makes.",
    scoreLabel: "makes / 10",
    benchmarkNote: "Scratch golfers make 9-10 of 10 putts from 4 feet.",
  },
  {
    name: "Speed Awareness",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    description: "Learn to control speed before worrying about the line.",
    instructions:
      "From 20 feet, hit 10 lag putts. Count how many finish within a 3-foot 'ok zone' around the hole (not too short, not too long).",
    scoreLabel: "putts in 3ft zone / 10",
    benchmarkNote: "Scratch golfers land in the zone on 6-7 of 10 lag putts.",
  },
  {
    name: "3-6-9 Ladder",
    skillArea: "PUTTING",
    difficultyLevel: "INTERMEDIATE",
    description: "Build confidence across the most common putt lengths.",
    instructions:
      "Putt 5 balls each from 3, 6, and 9 feet (15 putts total). Count total makes.",
    scoreLabel: "makes / 15",
    benchmarkNote: "Scratch golfers typically make 13-15 of 15.",
  },
  {
    name: "Lag Putting Circle",
    skillArea: "PUTTING",
    difficultyLevel: "INTERMEDIATE",
    description: "Improve distance control on long putts to avoid 3-putts.",
    instructions:
      "From 30+ feet, hit 10 lag putts. Count how many finish within a 3-foot circle of the hole.",
    scoreLabel: "lag putts inside 3ft / 10",
    benchmarkNote: "Scratch golfers land 6-7 of 10 inside a 3ft circle from long range.",
  },
  {
    name: "Breaking Putt Reads",
    skillArea: "PUTTING",
    difficultyLevel: "INTERMEDIATE",
    description: "Test green-reading accuracy combined with speed control.",
    instructions:
      "Hit 10 putts on genuinely breaking putts (varied reads). Count how many finish within 2 feet of the hole.",
    scoreLabel: "putts inside 2ft / 10",
  },
  {
    name: "The Clock Drill",
    skillArea: "PUTTING",
    difficultyLevel: "ADVANCED",
    description: "Pressure-test short putts from all angles around the hole.",
    instructions:
      "Place 8 balls in a clock pattern around the hole, each 4 feet away. Putt all 8. Count makes.",
    scoreLabel: "makes / 8",
    benchmarkNote: "Scratch golfers make 7-8 of 8.",
  },
  {
    name: "Pressure Putting Countdown",
    skillArea: "PUTTING",
    difficultyLevel: "ADVANCED",
    description: "Simulate the pressure of a must-make putt.",
    instructions:
      "From 4 feet, putt until you miss, tracking your longest streak of consecutive makes. Attempt this 3 times and record your best streak.",
    scoreLabel: "longest streak (target: 10+ in a row)",
  },
  {
    name: "Two-Putt Discipline",
    skillArea: "PUTTING",
    difficultyLevel: "ADVANCED",
    description: "Eliminate 3-putts from long range, the biggest score-killer.",
    instructions:
      "From 30-50 feet, hit 10 approach putts. Count how many you two-putt or better (i.e., no 3-putts).",
    scoreLabel: "two-putts-or-better / 10",
    benchmarkNote: "Scratch golfers avoid 3-putts on 90%+ of long putts.",
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
