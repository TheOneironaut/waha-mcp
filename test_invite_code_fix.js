#!/usr/bin/env node

/**
 * Test script for group invite code fix
 */

import { WAHAClient } from "./dist/client/waha-client.js";
import { config } from "./dist/config.js";

async function testInviteCodeFix() {
  console.log("🧪 Testing Group Invite Code Fix\n");
  console.log("=" .repeat(50));

  const client = new WAHAClient(config.wahaBaseUrl, config.wahaApiKey);

  try {
    // Test with your actual group
    const session = "bot10";
    const groupId = "120363423077897152@g.us";

    console.log(`\n📝 Test 1: Get invite code with full groupId (${groupId})`);
    try {
      const result1 = await client.getGroupInviteCode(session, groupId);
      console.log("✅ Success!");
      console.log("Invite Code:", result1.inviteCode);
      console.log("Type:", typeof result1.inviteCode);
      console.log("Is URL:", result1.inviteCode.startsWith("https://"));
    } catch (error) {
      console.error("❌ Failed:", error.message);
    }

    console.log(`\n📝 Test 2: Get invite code with groupId without @g.us (120363423077897152)`);
    try {
      const result2 = await client.getGroupInviteCode(session, "120363423077897152");
      console.log("✅ Success!");
      console.log("Invite Code:", result2.inviteCode);
      console.log("Type:", typeof result2.inviteCode);
      console.log("Is URL:", result2.inviteCode.startsWith("https://"));
    } catch (error) {
      console.error("❌ Failed:", error.message);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Tests completed!\n");

  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

// Run tests
testInviteCodeFix();
