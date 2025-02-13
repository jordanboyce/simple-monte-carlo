const readline = require("readline");

// Function to create a user input interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user input
const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

(async () => {
  console.log("NFL Monte Carlo Simulation: Predict the Winner!");

  // Get user input
  const teamA = await askQuestion("Enter the name of Team A: ");
  const teamB = await askQuestion("Enter the name of Team B: ");
  const winProbabilityA = parseFloat(
    await askQuestion(`Enter the win probability for ${teamA} (0 to 1): `)
  );

  // Validate probability input
  if (isNaN(winProbabilityA) || winProbabilityA < 0 || winProbabilityA > 1) {
    console.log("Invalid probability! Must be between 0 and 1.");
    rl.close();
    return;
  }

  const winProbabilityB = 1 - winProbabilityA;
  const simulations = 10000; // Number of simulations
  let winsA = 0;
  let winsB = 0;

  // Monte Carlo Simulation
  for (let i = 0; i < simulations; i++) {
    const outcome = Math.random(); // Generate a random number between 0 and 1
    if (outcome < winProbabilityA) {
      winsA++;
    } else {
      winsB++;
    }
  }

  // Compute win percentages
  const percentA = ((winsA / simulations) * 100).toFixed(2);
  const percentB = ((winsB / simulations) * 100).toFixed(2);

  // Output results
  console.log("\n--- Simulation Results ---");
  console.log(`${teamA} wins: ${winsA} times (${percentA}%)`);
  console.log(`${teamB} wins: ${winsB} times (${percentB}%)`);
  console.log(`Predicted winner: ${winsA > winsB ? teamA : teamB}`);

  rl.close();
})();
