import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaClient } from "../app/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SkillArea = "DRIVER" | "APPROACH" | "CHIPPING" | "PUTTING";
type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type SeedDrill = {
  name: string;
  skillArea: SkillArea;
  difficultyLevel: DifficultyLevel;
  description: string;
  instructions: string;
  scoreLabel: string;
  benchmarkNote?: string;
  // Technique layer: the feel, the checkpoint, and the common fault + fix.
  coaching: string;
  // false when a LOWER score is better (avg putts, feet from pin).
  higherIsBetter?: boolean;
  // Six tier thresholds, Beginner → Tour, consumed by lib/rank.ts.
  benchmarks: [number, number, number, number, number, number];
};

export const drills: SeedDrill[] = [
  // ============================================================
  // DRIVER
  // ============================================================
  {
    name: "9-to-3 Center Strike Builder",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    description:
      "A half-swing drill that grooves flush center-face contact before you add speed.",
    instructions:
      "Tee it low. Make swings that run only from 9 o'clock (lead arm parallel) back to 3 o'clock (trail arm parallel), no more. Use impact tape or foot spray on the face. Hit 10 and count center-face strikes.",
    scoreLabel: "center strikes / 10",
    benchmarkNote: "Scratch golfers flush the center on 8-9 of 10 controlled swings.",
    coaching:
      "Feel: the club stays in front of your chest the whole way — chest and arms turn together, no independent hand flip. Checkpoint: finish balanced with the buckle facing the target. Common fault: casting from the top to add power, which moves the low point behind the ball and produces heel/toe strikes. Fix: keep it a 3/4-effort swing until the strike is repeatable, then lengthen it.",
    benchmarks: [3, 4, 5, 6, 8, 9],
  },
  {
    name: "Tee Height Consistency",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    description: "Build a repeatable tee height and check strike location on the face.",
    instructions:
      "Tee the ball so half of it sits above the crown at address. Spray the face. Hit 10 drives and count how many strike the center 'sweet zone'.",
    scoreLabel: "sweet-zone strikes / 10",
    benchmarkNote: "Scratch golfers strike the sweet zone on 8-9 of 10 drives.",
    coaching:
      "Feel: you're trying to hit up on the ball with the low point behind it — a driver is the one club you catch on the upswing. Checkpoint: a high strike toward the top-center of the face is ideal for launch and spin. Common fault: teeing too low, which drags the strike low on the face and adds spin. Fix: tee it higher than feels natural and let the ball sit forward, off the lead heel.",
    benchmarks: [3, 4, 5, 6, 8, 9],
  },
  {
    name: "Feet-Together Balance Swings",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    description:
      "Swings with your feet together expose balance and sequencing flaws instantly.",
    instructions:
      "Stand with your feet touching. Make full-speed driver swings hitting teed balls. If you stumble, you swung with your arms instead of your body. Hit 10 and count balanced, on-center strikes.",
    scoreLabel: "balanced center strikes / 10",
    coaching:
      "Feel: the swing is powered by your turn, not a lunge — if you can't stay balanced with feet together, you're using the ground and your arms out of sequence. Checkpoint: you should be able to hold your finish for three seconds. Common fault: swinging out of your feet toward the target. Fix: swing smoother and let rotation, not sway, create the speed.",
    benchmarks: [3, 4, 5, 6, 7, 9],
  },
  {
    name: "Alignment Check",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    description: "Verify pre-shot alignment is correct before every swing.",
    instructions:
      "Lay one alignment stick on your target line and one on your toe line. Before each of 10 drives, check your setup against both. Count how many setups were correctly aligned.",
    scoreLabel: "correct alignments / 10",
    coaching:
      "Feel: aim the clubface first at the target, then set your body parallel-left of it (for a right-hander) — like railroad tracks. Checkpoint: your toe line points left of the actual target, not at it. Common fault: aiming your body at the target, which forces compensations in the swing. Fix: pick an intermediate spot a foot in front of the ball on your line and aim the face over it.",
    benchmarks: [5, 6, 7, 8, 9, 10],
  },
  {
    name: "Fairway Finder",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    description: "Build consistency hitting the driver into a target fairway.",
    instructions:
      "Pick a fairway or a ~30-yard-wide target zone. Hit 10 drives. Count how many finish in the zone, regardless of distance.",
    scoreLabel: "fairways hit / 10",
    benchmarkNote: "Scratch golfers hit 6-7 of 10 fairways of this width.",
    coaching:
      "Feel: commit to one shape and play it every time — a reliable 5-yard fade beats a straight ball you can't repeat. Checkpoint: your misses should all curve the same direction. Common fault: trying to hit it dead straight, leaving both sides in play. Fix: pick a side of the fairway to start the ball and a single curve to bring it back.",
    benchmarks: [2, 3, 4, 6, 7, 9],
  },
  {
    name: "Start Line Control",
    skillArea: "DRIVER",
    difficultyLevel: "INTERMEDIATE",
    description: "Groove a repeatable start line for your tee shots.",
    instructions:
      "Set two alignment sticks a few feet in front of the ball, ~5 yards apart, forming a gate on your intended line. Hit 10 drives. Count how many start through the gate.",
    scoreLabel: "shots on line / 10",
    benchmarkNote: "Scratch golfers start 7+ of 10 shots on their intended line.",
    coaching:
      "Feel: the ball starts where the face points at impact — start line is roughly 75% face, 25% path. Checkpoint: watch the first 30 yards of flight, not where it finishes. Common fault: a face that's open or shut at impact sends the start line offline. Fix: check grip strength first; then rehearse a square face through the gate at half speed.",
    benchmarks: [3, 4, 5, 7, 8, 9],
  },
  {
    name: "Step-Through Sequencing",
    skillArea: "DRIVER",
    difficultyLevel: "INTERMEDIATE",
    description:
      "Trains the lower-body-led downswing that creates effortless clubhead speed.",
    instructions:
      "Start with feet together. As you finish the backswing, step your lead foot toward the target, then swing through. The step forces weight to shift before the arms fire. Hit 10 and rate strike + sequence 1-5 each, then average.",
    scoreLabel: "avg strike + sequence (1-5, higher is better)",
    coaching:
      "Feel: the sequence is lower body → torso → arms → club, like cracking a whip. The step teaches your weight to move toward the target first. Checkpoint: your lead hip clears while your hands are still dropping. Common fault: firing the arms and shoulders from the top ('over the top'). Fix: exaggerate the step and pause at the top so the lower body starts the downswing.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
  },
  {
    name: "Draw/Fade on Command",
    skillArea: "DRIVER",
    difficultyLevel: "INTERMEDIATE",
    description: "Control shot shape deliberately instead of hoping for one shape.",
    instructions:
      "Alternate: 5 drives trying to curve left-to-right (fade), 5 right-to-left (draw). Count how many curved as intended, regardless of amount.",
    scoreLabel: "shots curved as intended / 10",
    benchmarkNote: "Scratch golfers control shot shape on command 7+ of 10.",
    coaching:
      "Feel: shape comes from the relationship between face and path. For a fade, feel the face slightly closed to a path that swings left; for a draw, feel the face slightly closed to a path that swings right. Checkpoint: the ball starts on one side of your target and curves back. Common fault: manipulating with the hands and flipping. Fix: change your setup (stance and aim) to build the shape, then make your normal swing.",
    benchmarks: [3, 4, 5, 7, 8, 9],
  },
  {
    name: "Tempo Ladder",
    skillArea: "DRIVER",
    difficultyLevel: "INTERMEDIATE",
    description: "Find the swing tempo that produces your most reliable strike.",
    instructions:
      "Hit 3 drives each at slow, normal, and aggressive tempo (9 total). Rate strike quality 1-5 after each. Average all 9.",
    scoreLabel: "avg strike quality (1-5, higher is better)",
    coaching:
      "Feel: most amateurs strike best at about 80-85% effort — the 'smooth but committed' gear. Checkpoint: your best strikes usually come at a tempo that feels almost lazy. Common fault: equating effort with distance and swinging out of rhythm. Fix: find the effort level where contact is flush, then live there; speed follows good contact, not the reverse.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
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
    coaching:
      "Feel: run your full pre-shot routine on every ball — this drill is about repeating your process, not your swing. Checkpoint: identical routine and commitment on ball 3 as ball 1. Common fault: tightening up and steering once a set is on the line. Fix: breathe out before the takeaway and commit to the shot you picked; a decisive miss beats a tentative steer.",
    benchmarks: [0, 1, 2, 3, 4, 5],
  },
  {
    name: "Fairway Under Pressure",
    skillArea: "DRIVER",
    difficultyLevel: "ADVANCED",
    description: "One shot, one chance — like a real tee shot on a tight hole.",
    instructions:
      "Hit 10 individual tee shots, one ball each, no do-overs, at a tight ~20-yard-wide target. Count how many you find.",
    scoreLabel: "tight fairways hit / 10",
    benchmarkNote: "Scratch golfers hit ~6-7 of 10 tight fairways in this format.",
    coaching:
      "Feel: pick the smallest possible target and trust your stock shape — precision comes from a specific target, not a careful swing. Checkpoint: you can name your exact start line and curve before every ball. Common fault: aiming at 'the fairway' instead of a precise point. Fix: aim at a single tree or bunker edge and let your shape work off it.",
    benchmarks: [2, 3, 4, 6, 7, 9],
  },
  {
    name: "Launch Optimization",
    skillArea: "DRIVER",
    difficultyLevel: "ADVANCED",
    description: "Train a penetrating, efficient ball flight rather than a high, spinny one.",
    instructions:
      "Hit 10 drives focused on a low-spin, penetrating flight (not ballooning). Rate each flight 1-5 by eye. Average across all 10.",
    scoreLabel: "avg flight quality (1-5, higher is better)",
    coaching:
      "Feel: hit up on the ball with the handle leaning slightly away from the target at impact — this raises launch and lowers spin, the combination that carries. Checkpoint: the flight climbs, holds, and finishes flat rather than parachuting down. Common fault: a steep, descending strike that spins the ball up into a balloon. Fix: play the ball forward, tilt your trail shoulder down at address, and swing up through it.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
  },

  // ============================================================
  // APPROACH
  // ============================================================
  {
    name: "Divot-After-the-Ball",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description:
      "The single most important iron skill: hitting the ball first, then the ground.",
    instructions:
      "Lay a tee or a line of foot spray just in front of the ball (target side). Hit 10 mid-irons trying to bruise the ground on the target side of the ball, never behind it. Count ball-first strikes.",
    scoreLabel: "ball-first strikes / 10",
    benchmarkNote: "Scratch golfers compress the ball first on 8-9 of 10 irons.",
    coaching:
      "Feel: your low point is in front of the ball — you're trapping the ball against the turf, then taking a divot beyond it. Checkpoint: the divot starts at or ahead of the ball's original position. Common fault: hanging back on the trail foot and bottoming out behind the ball (fat/thin). Fix: at impact feel your weight on the lead foot and the handle ahead of the clubhead.",
    benchmarks: [3, 4, 5, 6, 8, 9],
  },
  {
    name: "Solid Strike Check",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description: "Confirm center-face contact before worrying about targets.",
    instructions:
      "Spray the face or use a strike mat. Hit 10 mid-iron approaches. Count center-face strikes.",
    scoreLabel: "center strikes / 10",
    benchmarkNote: "Scratch golfers strike center-face on 8-9 of 10 irons.",
    coaching:
      "Feel: return the club to the same spot it started, with your chest covering the ball through impact. Checkpoint: strikes clustered in the center of the face, slightly toward the toe is fine. Common fault: early extension (standing up through impact), which pushes strikes toward the heel/shank. Fix: keep your trail hip back and your chest down through the ball.",
    benchmarks: [3, 4, 5, 6, 8, 9],
  },
  {
    name: "Towel-Under-Arms Connection",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description:
      "Keeps the arms and body working together for a consistent low point.",
    instructions:
      "Tuck a towel or headcover under both armpits. Hit 10 half-to-three-quarter iron shots without dropping it. Count shots kept connected AND struck cleanly.",
    scoreLabel: "connected clean strikes / 10",
    coaching:
      "Feel: the upper arms stay glued to your chest so the big muscles control the swing — the club moves because your body turns. Checkpoint: the towel stays put through impact. Common fault: the arms running away from the body ('flying'), which wrecks strike consistency. Fix: make smaller swings until you can keep the towel, then gradually lengthen.",
    benchmarks: [3, 4, 5, 6, 7, 9],
  },
  {
    name: "Club Selection Confidence",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description: "Build trust in your real carry yardages, not your ego yardages.",
    instructions:
      "Hit to 5 random approach yardages, picking the club you'd naturally choose. Rate pre-shot confidence 1-5 each. Average the ratings.",
    scoreLabel: "avg pre-shot confidence (1-5)",
    coaching:
      "Feel: commit to a club that carries the ball to the middle of the green on a normal swing — most amateurs come up short because they club for their best shot, not their average one. Checkpoint: you'd take that club again knowing the result. Common fault: under-clubbing and swinging harder. Fix: learn your true carry numbers and take one more club than pride suggests.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
  },
  {
    name: "Distance Control Ladder",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description: "Dial in proximity across a range of approach distances.",
    instructions:
      "Pick 3 distances (e.g. 100, 125, 150). Hit 3 balls to each. Score each: inside 10ft = 3, 10-20ft = 2, 20-30ft = 1, outside = 0. Sum the total.",
    scoreLabel: "total points / 27",
    benchmarkNote: "Scratch golfers typically score 18-22 of 27.",
    coaching:
      "Feel: distance control is mostly about center-face contact and consistent tempo, not swinging harder or softer. Checkpoint: your worst miss is short-and-center, never long. Common fault: decelerating on the shorter numbers. Fix: control distance by controlling swing length, but always accelerate through the ball.",
    benchmarks: [8, 12, 15, 18, 21, 24],
  },
  {
    name: "Circle Drill",
    skillArea: "APPROACH",
    difficultyLevel: "INTERMEDIATE",
    description: "Test proximity consistency from a single approach distance.",
    instructions:
      "From 120 yards, hit 10 approaches. Count how many finish inside an imaginary 20-foot circle around the flag.",
    scoreLabel: "shots inside 20ft / 10",
    benchmarkNote: "Scratch golfers land 6-7 of 10 inside a 20ft circle from 120.",
    coaching:
      "Feel: aim at the center of the green and let good contact bring you close — chasing tucked pins from 120 is a scoring mistake even for pros. Checkpoint: a tight cluster near the middle. Common fault: aiming at the flag on every shot. Fix: default to the fat part of the green and only fire at pins you can reach with your stock shot.",
    benchmarks: [2, 3, 4, 6, 7, 9],
  },
  {
    name: "Trajectory Control",
    skillArea: "APPROACH",
    difficultyLevel: "INTERMEDIATE",
    description: "Control ball-flight height to handle wind and pin positions.",
    instructions:
      "To the same target, hit 3 low, 3 medium, 3 high (9 total). Rate how well each matched the intended flight 1-5. Average all 9.",
    scoreLabel: "avg trajectory match (1-5, higher is better)",
    coaching:
      "Feel: ball position and finish length control height. Back in the stance with a shorter finish flights it down; forward with a full finish flights it up. Checkpoint: the low one bores through wind; the high one lands soft. Common fault: trying to lift the ball with the hands for the high shot. Fix: let loft and ball position do the work — swing the same, change the setup.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
  },
  {
    name: "Random Yardage Precision",
    skillArea: "APPROACH",
    difficultyLevel: "INTERMEDIATE",
    description: "Practice adjusting to unpredictable yardages like you face on course.",
    instructions:
      "Pick 5 random distances between 80-160 yards. Hit one shot to each. Record your distance from the pin in feet, then average them.",
    scoreLabel: "avg distance from pin in feet (lower is better)",
    benchmarkNote: "Scratch golfers average ~25-35 feet across varied yardages.",
    coaching:
      "Feel: run your full routine — pick a target, commit, execute — as if each is a real shot, because on course you never get two in a row from the same number. Checkpoint: no double-cross misses (starting and curving the same way). Common fault: guessing the yardage. Fix: know your carry gaps between clubs so you're never between two clubs without a plan.",
    higherIsBetter: false,
    benchmarks: [50, 44, 38, 32, 26, 20],
  },
  {
    name: "Pin-High Precision",
    skillArea: "APPROACH",
    difficultyLevel: "ADVANCED",
    description: "Isolate distance control by ignoring left-right entirely.",
    instructions:
      "From 100-150 yards, hit 10 shots focused purely on distance. Count how many finish pin-high within 10 feet (front or back).",
    scoreLabel: "pin-high shots / 10",
    benchmarkNote: "Scratch golfers finish pin-high within 10ft on ~6 of 10.",
    coaching:
      "Feel: distance is king — most amateurs' proximity is ruined by short-siding on distance, not direction. Checkpoint: your misses are pin-high, just left or right. Common fault: inconsistent contact changing carry by 10-15 yards. Fix: prioritize a flush strike; a slightly offline pin-high shot is a makeable birdie putt.",
    benchmarks: [1, 2, 3, 5, 6, 8],
  },
  {
    name: "Approach Under Pressure",
    skillArea: "APPROACH",
    difficultyLevel: "ADVANCED",
    description: "One shot per hole, like real approach shots on the course.",
    instructions:
      "Simulate 10 approaches from varying distances, one ball each. Each must finish inside a 15-foot circle to pass. Count passes.",
    scoreLabel: "passes / 10",
    benchmarkNote: "Scratch golfers pass on ~5-6 of 10 attempts.",
    coaching:
      "Feel: a clear, committed target and a full routine on every ball. Checkpoint: you can describe the shot you intend before you hit it. Common fault: going through the motions without a specific target under 'pressure'. Fix: treat each ball as the 18th hole — pick the target, commit, and accept the result.",
    benchmarks: [1, 2, 3, 5, 6, 8],
  },
  {
    name: "Wind/Trouble Management",
    skillArea: "APPROACH",
    difficultyLevel: "ADVANCED",
    description: "Play away from trouble instead of always attacking the pin.",
    instructions:
      "Imagine a tucked pin guarded by a hazard on one side. Hit 10 approaches aimed at the safe portion of the green. Count how many finish on the safe side.",
    scoreLabel: "safe-side shots / 10",
    coaching:
      "Feel: aim at the spot that leaves your next shot easiest, not the spot closest to the hole — great course management turns bogeys into pars. Checkpoint: your miss is always to the safe, open side. Common fault: firing at sucker pins and short-siding yourself. Fix: identify the trouble first, then pick the target that takes it out of play.",
    benchmarks: [3, 4, 5, 7, 8, 9],
  },
  {
    name: "Feet-Together Iron Flush",
    skillArea: "APPROACH",
    difficultyLevel: "BEGINNER",
    description:
      "Feet-together iron swings train balance and a body-driven strike.",
    instructions:
      "With feet touching, hit 10 mid-irons at three-quarter speed. If you lose balance, you swung with your arms. Count balanced, ball-first strikes.",
    scoreLabel: "balanced ball-first strikes / 10",
    coaching:
      "Feel: the turn powers the swing, so you can stay centered and still catch the ball first. Checkpoint: hold the finish for three seconds. Common fault: swaying off the ball and lunging at it. Fix: rotate around a stable center; if you fall toward the target, you shifted too aggressively.",
    benchmarks: [3, 4, 5, 6, 7, 9],
  },

  // ============================================================
  // CHIPPING
  // ============================================================
  {
    name: "Ball-First Low-Point Chips",
    skillArea: "CHIPPING",
    difficultyLevel: "BEGINNER",
    description:
      "The foundation of chipping: catching the ball before the turf, every time.",
    instructions:
      "Place a tee or coin an inch in front of the ball. Hit 10 chips catching the ball first and clipping the ground on the target side. Count clean ball-first strikes.",
    scoreLabel: "ball-first chips / 10",
    benchmarkNote: "Scratch golfers strike ball-first on 9-10 of 10 chips.",
    coaching:
      "Feel: set up with the handle leaning slightly toward the target and 60% of your weight on the lead foot — then keep it there. The club should brush the grass under the ball, not dig behind it. Checkpoint: hands lead the clubhead through impact. Common fault: trying to scoop or lift the ball, adding loft with the wrists. Fix: keep the lead wrist firm and let the loft of the club get the ball up.",
    benchmarks: [4, 5, 6, 7, 9, 10],
  },
  {
    name: "Landing Spot Precision",
    skillArea: "CHIPPING",
    difficultyLevel: "BEGINNER",
    description: "Train precise landing-spot control — the real skill in chipping.",
    instructions:
      "Pick a landing spot partway to the hole (~3-foot target). Hit 10 chips. Count how many land within it.",
    scoreLabel: "chips on landing spot / 10",
    benchmarkNote: "Scratch golfers land 7+ of 10 chips on their spot.",
    coaching:
      "Feel: you're throwing the ball to a spot and letting it roll out — pick the landing spot first, then the club that rolls it the right distance. Checkpoint: your eyes lock onto the landing spot, not the hole. Common fault: staring at the flag and landing the ball inconsistently. Fix: for every chip, name the exact spot you want the ball to land, then commit to it.",
    benchmarks: [3, 4, 5, 7, 8, 10],
  },
  {
    name: "Trail-Arm-Only Chips",
    skillArea: "CHIPPING",
    difficultyLevel: "BEGINNER",
    description: "Teaches the released, no-flip feel of a solid chip.",
    instructions:
      "Chip 10 balls using only your trail arm (right arm for a right-hander), lead hand off the club. Count solid, on-line chips.",
    scoreLabel: "solid trail-arm chips / 10",
    coaching:
      "Feel: the trail arm and the shaft move as one unit, rotating through — no wristy flip, because one hand can't scoop. Checkpoint: the clubface stays low and rotates gently closed past impact. Common fault: flipping the wrists to help the ball up. Fix: this drill physically prevents the flip; take that same quiet-hands feel into your two-handed chips.",
    benchmarks: [3, 4, 5, 6, 7, 9],
  },
  {
    name: "Club Selection for Lies",
    skillArea: "CHIPPING",
    difficultyLevel: "BEGINNER",
    description: "Match technique and club to the lie you're actually facing.",
    instructions:
      "Practice from 3 lie types (clean fairway, light rough, tight/bare) with the right technique for each. Self-rate execution 1-5 per lie. Average the 3.",
    scoreLabel: "avg execution quality (1-5, higher is better)",
    coaching:
      "Feel: from a tight lie use a less-lofted club and a putting-style stroke; from fluffy rough use more loft and let the club slide under. Checkpoint: you read the lie before choosing the shot. Common fault: using a lob wedge from everywhere. Fix: default to the least-lofted club that carries the trouble and rolls to the hole — the ball on the ground is the highest-percentage play.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
  },
  {
    name: "3-Foot Circle Chipping",
    skillArea: "CHIPPING",
    difficultyLevel: "INTERMEDIATE",
    description: "Measure your chipping proximity from a consistent lie.",
    instructions:
      "From the same 15-20 yard lie, hit 10 chips. Count how many finish within 3 feet of the hole.",
    scoreLabel: "chips inside 3ft / 10",
    benchmarkNote: "Scratch golfers finish inside 3ft on ~5-6 of 10 chips.",
    coaching:
      "Feel: land the ball on your spot with the right club and the roll takes care of the rest. Checkpoint: consistent landing spot produces consistent finish. Common fault: changing swing speed to change distance instead of changing clubs. Fix: keep a repeatable chipping stroke and let club selection (7-iron vs wedge) control how far it rolls.",
    benchmarks: [2, 3, 4, 5, 6, 8],
  },
  {
    name: "Bump-and-Run vs Lofted Choice",
    skillArea: "CHIPPING",
    difficultyLevel: "INTERMEDIATE",
    description: "Build decision-making between low-running and high-lofted chips.",
    instructions:
      "For 10 varied chips, choose and execute whichever shot fits (bump-and-run or lofted). Self-rate decision + execution 1-5 each. Average all 10.",
    scoreLabel: "avg decision + execution (1-5)",
    coaching:
      "Feel: when you have green to work with, the ball on the ground is safest; only go high when you must carry trouble or stop it fast. Checkpoint: your default is the lower, running shot. Common fault: defaulting to a high flop everywhere, which brings chunks and thins into play. Fix: ask 'what's the simplest shot that works?' before every chip.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
  },
  {
    name: "Uphill/Downhill Lies",
    skillArea: "CHIPPING",
    difficultyLevel: "INTERMEDIATE",
    description: "Handle the adjustments uphill and downhill chips require.",
    instructions:
      "Hit 10 chips split between uphill and downhill lies. Count how many finish within 6 feet.",
    scoreLabel: "chips inside 6ft / 10",
    coaching:
      "Feel: set your shoulders to match the slope so the club can swing along the ground. Uphill adds loft (club down, expect less roll); downhill delofts (the ball comes out low and runs). Checkpoint: your lead shoulder is lower on an uphill lie, higher on a downhill one. Common fault: standing vertical and chunking uphill or blading downhill. Fix: tilt with the slope and let the club follow the hill.",
    benchmarks: [2, 3, 4, 5, 6, 8],
  },
  {
    name: "Tight Lie Precision",
    skillArea: "CHIPPING",
    difficultyLevel: "ADVANCED",
    description: "The hardest common chipping lie — thin margin for error.",
    instructions:
      "From a very tight fairway or bare lie, hit 10 chips. Count clean strikes (no chunks/thins) that also land on your spot.",
    scoreLabel: "clean strikes on target / 10",
    benchmarkNote: "Scratch golfers execute cleanly from tight lies on ~6-7 of 10.",
    coaching:
      "Feel: use the leading edge, not the bounce — lean the shaft forward, weight on the lead side, and clip the ball off the top of the turf. Checkpoint: hands well ahead of the ball at address and impact. Common fault: adding bounce with a scooping wedge, which skips the club into the ball's equator (thin). Fix: pick a lower-lofted club, set the handle forward, and make a firm, descending clip.",
    benchmarks: [2, 3, 4, 6, 7, 8],
  },
  {
    name: "Up-and-Down Challenge",
    skillArea: "CHIPPING",
    difficultyLevel: "ADVANCED",
    description: "Practice the full short-game sequence: chip plus a putt to finish.",
    instructions:
      "Drop balls in 10 spots around the green (within 30 yards). From each, chip and putt out. Count up-and-downs in 2 total strokes.",
    scoreLabel: "up-and-downs / 10",
    benchmarkNote: "Scratch golfers get up-and-down ~5-6 of 10 times.",
    coaching:
      "Feel: the goal of every chip is to leave a stress-free putt — proximity matters more than holing out. Checkpoint: you're rolling most chips inside 4 feet. Common fault: firing at the hole and leaving tricky 6-footers when you miss. Fix: chip to the center of your 'makeable' range and let your putting close it out.",
    benchmarks: [2, 3, 4, 5, 6, 8],
  },
  {
    name: "Scrambling Simulation",
    skillArea: "CHIPPING",
    difficultyLevel: "ADVANCED",
    description: "Simulate a full round's worth of missed greens.",
    instructions:
      "Simulate 9 missed-green scenarios with varied lies and distances. For each, try to get up-and-down. Count successful scrambles.",
    scoreLabel: "scrambles / 9",
    benchmarkNote: "Scratch golfers scramble (save par) ~50-60% of the time.",
    coaching:
      "Feel: accept the bogey-proof play — get the ball on the green and give yourself a putt every time. Checkpoint: you never leave a chip off the green or short-side yourself. Common fault: trying to hole every scramble and turning bogeys into doubles. Fix: your first job is to stop the bleeding; take the shot that guarantees a putt at par.",
    benchmarks: [1, 2, 3, 4, 5, 7],
  },
  {
    name: "Clock-Face Carry Ladder",
    skillArea: "CHIPPING",
    difficultyLevel: "INTERMEDIATE",
    description: "Calibrates repeatable pitch distances by backswing length.",
    instructions:
      "With one wedge, make three backswing lengths — hands to 'hip' (7:30), 'chest' (9:00), and 'shoulder' (10:30). Hit 3 balls each and record the average carry for each length. Score how tightly each group clusters, 1-5, then average.",
    scoreLabel: "avg distance consistency (1-5, higher is better)",
    coaching:
      "Feel: distance comes from a fixed backswing length swung at a constant tempo, not from hands and effort. Checkpoint: each backswing length produces a repeatable carry number you can trust on course. Common fault: one 'full' wedge swing decelerated to different lengths. Fix: build three reference swings you can call on for any partial wedge.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
  },
  {
    name: "Flop Shot Control",
    skillArea: "CHIPPING",
    difficultyLevel: "ADVANCED",
    description: "The high, soft shot for when you must carry trouble and stop it fast.",
    instructions:
      "From a decent lie, open the face of your most-lofted wedge and hit 10 high, soft shots over a barrier to a tight pin. Count how many carry the barrier AND finish within 10 feet.",
    scoreLabel: "successful flops inside 10ft / 10",
    coaching:
      "Feel: open the face first, then take your grip; let the bounce slide under the ball as you swing along your body line with an accelerating, full finish. Checkpoint: the face stays open and pointing skyward through impact. Common fault: decelerating out of fear, which digs the leading edge and blades it. Fix: commit to a long, smooth, accelerating swing — the loft, not the speed, keeps it short.",
    benchmarks: [1, 2, 3, 4, 6, 8],
  },

  // ============================================================
  // PUTTING
  // ============================================================
  {
    name: "Sweet-Spot Coin Roll",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    description: "Center-face contact — the hidden key to putting distance control.",
    instructions:
      "Put two small dots (or a rubber band) on the putter face framing the sweet spot. From 10 feet, hit 10 putts and count how many come off the center pure, with no twist.",
    scoreLabel: "pure center rolls / 10",
    coaching:
      "Feel: the ball springs off the face with no vibration — off-center hits lose distance and twist the face offline. Checkpoint: the putter face stays square and the ball rolls end-over-end quickly. Common fault: heel/toe strikes that make good speed impossible to judge. Fix: stand so your eyes are over the ball and the putter returns to the same spot it started.",
    benchmarks: [4, 5, 6, 7, 8, 10],
  },
  {
    name: "Gate Drill",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    description: "Groove a square face and start line on short putts.",
    instructions:
      "Set a gate slightly wider than the putter head ~6 inches in front of the ball, on a straight 6-foot putt. Hit 10 putts. Count how many roll through without touching the tees.",
    scoreLabel: "putts through gate / 10",
    benchmarkNote: "Scratch golfers pass the gate on 8-9 of 10 putts.",
    coaching:
      "Feel: the face controls the start line almost entirely on a putt — keep it square through the gate. Checkpoint: the ball splits the gate every time. Common fault: manipulating the stroke path with the hands. Fix: let the stroke rock from the shoulders like a pendulum; keep the wrists quiet and the face passive.",
    benchmarks: [5, 6, 7, 8, 9, 10],
  },
  {
    name: "Metronome Tempo Stroke",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    description: "Builds the consistent stroke rhythm that produces reliable speed.",
    instructions:
      "Set a metronome (phone app) to ~76 bpm. Stroke putts so the backstroke ends on one beat and impact lands on the next. Hit 10 putts from 15 feet and rate rhythm 1-5 each, then average.",
    scoreLabel: "avg tempo rhythm (1-5, higher is better)",
    coaching:
      "Feel: the stroke is a smooth, even pendulum — same time back and through, distance controlled by length not by hit. Checkpoint: back and through take the same amount of time regardless of putt length. Common fault: a quick, jabby forward stroke that spikes speed. Fix: let longer putts have longer strokes at the same tempo, never a harder hit.",
    higherIsBetter: true,
    benchmarks: [2, 2.5, 3, 3.5, 4, 4.5],
  },
  {
    name: "Straight Putt Repeater",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    description: "Build a repeatable stroke on the simplest possible putt.",
    instructions:
      "From 4 feet on a straight, flat putt, hit 10 putts. Count makes.",
    scoreLabel: "makes / 10",
    benchmarkNote: "Scratch golfers make 9-10 of 10 from 4 feet.",
    coaching:
      "Feel: pick your line, set the face square to it, and roll it firmly to take the break out. Checkpoint: the ball hits the back of the cup, not the low side. Common fault: babying it and letting the ball wander offline near the hole. Fix: on short putts, commit to a firm roll that removes small breaks — 'never up, never in'.",
    benchmarks: [5, 6, 7, 8, 9, 10],
  },
  {
    name: "Speed Awareness",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    description: "Learn to control speed before worrying about the line.",
    instructions:
      "From 20 feet, hit 10 lag putts. Count how many finish within a 3-foot 'ok zone' around the hole.",
    scoreLabel: "putts in 3ft zone / 10",
    benchmarkNote: "Scratch golfers land in the zone on 6-7 of 10 lags.",
    coaching:
      "Feel: on long putts, speed matters far more than line — aim to die the ball into a 3-foot circle. Checkpoint: your misses finish hole-high, not 6 feet short or long. Common fault: fixating on the exact line and leaving putts well short. Fix: look at the hole while making practice strokes to let your body feel the distance, then trust it.",
    benchmarks: [3, 4, 5, 6, 8, 9],
  },
  {
    name: "3-6-9 Ladder",
    skillArea: "PUTTING",
    difficultyLevel: "INTERMEDIATE",
    description: "Build confidence across the most common putt lengths.",
    instructions:
      "Putt 5 balls each from 3, 6, and 9 feet (15 total). Count total makes.",
    scoreLabel: "makes / 15",
    benchmarkNote: "Scratch golfers typically make 13-15 of 15.",
    coaching:
      "Feel: same rhythm at all three distances — only the stroke length grows. Checkpoint: your 9-footers roll with the same tempo as your 3-footers. Common fault: getting quick and handsy as the putt lengthens. Fix: lengthen the stroke, not the effort, and keep the through-stroke at least as long as the back-stroke.",
    benchmarks: [7, 9, 11, 12, 14, 15],
  },
  {
    name: "Breaking Putt Reads",
    skillArea: "PUTTING",
    difficultyLevel: "INTERMEDIATE",
    description: "Test green-reading accuracy combined with speed control.",
    instructions:
      "Hit 10 genuinely breaking putts (varied reads). Count how many finish within 2 feet.",
    scoreLabel: "putts inside 2ft / 10",
    coaching:
      "Feel: read the last few feet before the hole — that's where the ball is slowest and breaks most. Speed determines break, so pick a speed first, then a line for that speed. Checkpoint: you commit to an apex point and roll it there. Common fault: under-reading break and aiming too close to the hole. Fix: play more break than you think and let the ball 'die' into the high side of the cup.",
    benchmarks: [2, 3, 4, 6, 7, 9],
  },
  {
    name: "Lag Putting Circle",
    skillArea: "PUTTING",
    difficultyLevel: "INTERMEDIATE",
    description: "Improve distance control on long putts to avoid 3-putts.",
    instructions:
      "From 30+ feet, hit 10 lag putts. Count how many finish within a 3-foot circle of the hole.",
    scoreLabel: "lag putts inside 3ft / 10",
    benchmarkNote: "Scratch golfers land 6-7 of 10 inside 3ft from long range.",
    coaching:
      "Feel: match the stroke length to the distance and trust it — long putting is a feel skill, not a mechanical one. Checkpoint: consistent finish distance, never a big miss short or long. Common fault: leaving everything short from fear of the comeback putt. Fix: rehearse looking at the hole, then commit to getting the ball there or just past.",
    benchmarks: [3, 4, 5, 6, 8, 9],
  },
  {
    name: "The Clock Drill",
    skillArea: "PUTTING",
    difficultyLevel: "ADVANCED",
    description: "Pressure-test short putts from all angles around the hole.",
    instructions:
      "Place 8 balls in a clock pattern around the hole, each 4 feet out. Putt all 8. Count makes.",
    scoreLabel: "makes / 8",
    benchmarkNote: "Scratch golfers make 7-8 of 8.",
    coaching:
      "Feel: read each angle fresh — the same 4-footer breaks differently from every side. Checkpoint: you reset your read and your line for each ball. Common fault: assuming they're all straight and missing the subtle breakers. Fix: treat each as its own putt: square the face to your chosen line and roll it firmly.",
    benchmarks: [3, 4, 5, 6, 7, 8],
  },
  {
    name: "Pressure Putting Countdown",
    skillArea: "PUTTING",
    difficultyLevel: "ADVANCED",
    description: "Simulate the pressure of a must-make putt.",
    instructions:
      "From 4 feet, putt until you miss, tracking your longest streak of consecutive makes. Attempt 3 times; record your best streak.",
    scoreLabel: "longest streak (target: 10+ in a row)",
    coaching:
      "Feel: repeat the exact same routine on the tenth putt as the first — pressure putting is routine under strain. Checkpoint: identical setup, look, and stroke every time. Common fault: speeding up or changing your read as the streak grows. Fix: breathe, run your routine, and commit to a firm roll; let the process, not the outcome, hold your attention.",
    benchmarks: [3, 5, 7, 10, 14, 18],
  },
  {
    name: "Two-Putt Discipline",
    skillArea: "PUTTING",
    difficultyLevel: "ADVANCED",
    description: "Eliminate 3-putts from long range, the biggest score-killer.",
    instructions:
      "From 30-50 feet, hit 10 approach putts. Count how many you two-putt or better (no 3-putts).",
    scoreLabel: "two-putts-or-better / 10",
    benchmarkNote: "Scratch golfers avoid 3-putts on 90%+ of long putts.",
    coaching:
      "Feel: your only job on the first putt is speed — leave it inside a 3-foot circle and the second putt is a formality. Checkpoint: every lag finishes hole-high. Common fault: over-reading the line and neglecting speed, leaving long second putts. Fix: spend 80% of your read on how hard, 20% on where; distance control kills 3-putts.",
    benchmarks: [5, 6, 7, 8, 9, 10],
  },
  {
    name: "Eyes-Closed Speed Control",
    skillArea: "PUTTING",
    difficultyLevel: "INTERMEDIATE",
    description: "Sharpens the feel for distance by removing your eyes from the stroke.",
    instructions:
      "From 25 feet, take your read, then close your eyes and putt. Open them and note where it finished. Hit 10 and count how many stop within 3 feet — trusting feel, not sight.",
    scoreLabel: "eyes-closed putts in 3ft / 10",
    coaching:
      "Feel: with your eyes closed your body naturally matches stroke length to the distance you saw — that's pure feel, the thing great lag putters rely on. Checkpoint: your guesses of where it finished are close to reality. Common fault: steering the putter with your eyes and hands instead of feeling the distance. Fix: on course, look at the hole during practice strokes to load the same feel, then trust it.",
    benchmarks: [2, 3, 4, 6, 7, 9],
  },
];

async function main() {
  for (const drill of drills) {
    const data = {
      ...drill,
      higherIsBetter: drill.higherIsBetter ?? true,
      benchmarks: drill.benchmarks,
    };
    const existing = await prisma.drill.findFirst({ where: { name: drill.name } });
    if (existing) {
      await prisma.drill.update({ where: { id: existing.id }, data });
    } else {
      await prisma.drill.create({ data });
    }
  }
  console.log(`Seeded ${drills.length} drills.`);
}

// Only run the seeder when this file is executed directly (e.g. `tsx
// prisma/seed.ts`), so the drills array can be imported for validation/tests
// without opening a database connection.
if (process.argv[1]?.includes("seed")) {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
