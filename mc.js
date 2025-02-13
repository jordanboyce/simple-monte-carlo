const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Function to convert point spread into win probability
const pointSpreadToProbability = (spread) => {
  return 1 / (1 + Math.pow(10, -spread / 10));
};

// Function to adjust probability for home-field advantage
const adjustForHomeField = (probability, homeFieldAdvantage) => {
  return probability + homeFieldAdvantage;
};

// Function to adjust probability for injuries
const adjustForInjuries = (probability, teamAInjury, teamBInjury) => {
  return probability - teamAInjury + teamBInjury;
};

(async () => {
  console.log("\n Monte Carlo Simulation: Predict the Winner! ");

  // Get user input
  const teamA = await askQuestion("Enter the name of Team A: ");
  const teamB = await askQuestion("Enter the name of Team B: ");
  const pointSpread = parseFloat(
    await askQuestion(`Enter the point spread for ${teamA} (negative if favored, positive if underdog): `)
  );
  const homeFieldAdvantage = parseFloat(
    await askQuestion(`Enter home-field advantage for ${teamA} (e.g., 0.03 for 3% boost): `)
  );
  const teamAInjury = parseFloat(
    await askQuestion(`Enter injury impact for ${teamA} (e.g., 0.02 for 2% reduction): `)
  );
  const teamBInjury = parseFloat(
    await askQuestion(`Enter injury impact for ${teamB} (e.g., 0.02 for 2% reduction): `)
  );

  // Convert point spread to an initial probability
  let winProbabilityA = pointSpreadToProbability(-pointSpread);

  // Adjust for home-field advantage and injuries
  winProbabilityA = adjustForHomeField(winProbabilityA, homeFieldAdvantage);
  winProbabilityA = adjustForInjuries(winProbabilityA, teamAInjury, teamBInjury);

  // Ensure probability stays within valid range
  winProbabilityA = Math.max(0, Math.min(1, winProbabilityA));
  const winProbabilityB = 1 - winProbabilityA;

  const simulations = 10000;
  let winsA = 0;
  let winsB = 0;

  // Monte Carlo Simulation
  for (let i = 0; i < simulations; i++) {
    const outcome = Math.random();
    if (outcome < winProbabilityA) {
      winsA++;
    } else {
      winsB++;
    }
  }

  // Compute win percentages
  const percentA = ((winsA / simulations) * 100).toFixed(2);
  const percentB = ((winsB / simulations) * 100).toFixed(2);

  // Output results with user inputs
  console.log("\n=== INPUT PARAMETERS ===");
  console.log(`Team A: ${teamA}`);
  console.log(`Team B: ${teamB}`);
  console.log(`📊 Point Spread: ${pointSpread}`);
  console.log(`🏟️ Home-Field Advantage: ${homeFieldAdvantage}`);
  console.log(`🚑 Injury Impact (${teamA}): ${teamAInjury}`);
  console.log(`🚑 Injury Impact (${teamB}): ${teamBInjury}`);

  console.log("\n=== SIMULATION RESULTS ===");
  console.log(`✅ ${teamA} wins: ${winsA} times (${percentA}%)`);
  console.log(`✅ ${teamB} wins: ${winsB} times (${percentB}%)`);
  console.log(`🏆 Predicted winner: ${winsA > winsB ? teamA : teamB}`);

  rl.close();
})();
