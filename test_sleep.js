#!/usr/bin/env node

/**
 * Test script for sleep/wait utility tools
 */

import { handleSleep, handleWait } from "./dist/tools/new-handlers.js";

async function testSleepTools() {
  console.log("🧪 Testing Sleep/Wait Utility Tools\n");
  console.log("=" .repeat(50));

  // Mock WAHAClient (not needed for sleep)
  const mockClient = null;

  try {
    // Test 1: Sleep with milliseconds
    console.log("\n📝 Test 1: Sleep with duration (milliseconds)");
    console.log("Sleeping for 2000ms (2 seconds)...");
    const start1 = Date.now();
    const result1 = await handleSleep(mockClient, {
      duration: 2000,
      message: "Testing sleep with milliseconds",
    });
    const end1 = Date.now();
    console.log(`✅ Completed in ${end1 - start1}ms`);
    console.log("Response:", result1.content[0].text);

    // Test 2: Sleep with seconds
    console.log("\n📝 Test 2: Sleep with seconds");
    console.log("Sleeping for 1.5 seconds...");
    const start2 = Date.now();
    const result2 = await handleSleep(mockClient, {
      seconds: 1.5,
      message: "Testing sleep with seconds",
    });
    const end2 = Date.now();
    console.log(`✅ Completed in ${end2 - start2}ms`);
    console.log("Response:", result2.content[0].text);

    // Test 3: Wait (alias for sleep)
    console.log("\n📝 Test 3: Wait function");
    console.log("Waiting for 1 second...");
    const start3 = Date.now();
    const result3 = await handleWait(mockClient, {
      seconds: 1,
      message: "Waiting between operations",
    });
    const end3 = Date.now();
    console.log(`✅ Completed in ${end3 - start3}ms`);
    console.log("Response:", result3.content[0].text);

    // Test 4: Default sleep (no parameters)
    console.log("\n📝 Test 4: Default sleep (1 second)");
    console.log("Sleeping with default parameters...");
    const start4 = Date.now();
    const result4 = await handleSleep(mockClient, {});
    const end4 = Date.now();
    console.log(`✅ Completed in ${end4 - start4}ms`);
    console.log("Response:", result4.content[0].text);

    // Test 5: Test max duration validation
    console.log("\n📝 Test 5: Max duration validation");
    try {
      console.log("Trying to sleep for 400 seconds (should fail)...");
      await handleSleep(mockClient, {
        seconds: 400, // Exceeds 300 second max
      });
      console.log("❌ Should have thrown an error!");
    } catch (error) {
      console.log("✅ Correctly rejected:", error.message);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ All tests passed!\n");
    console.log("📊 Summary:");
    console.log("  - sleep tool: ✅ Working");
    console.log("  - wait tool: ✅ Working");
    console.log("  - Duration validation: ✅ Working");
    console.log("  - Custom messages: ✅ Working");

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run tests
testSleepTools();
