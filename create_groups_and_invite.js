#!/usr/bin/env node

/**
 * Create 3 groups and add bots bot10-12 to each
 * With delays to prevent blocking
 */

import { WAHAClient } from './dist/client/waha-client.js';
import dotenv from 'dotenv';

dotenv.config();

// Helper function for delay
const delay = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

async function createGroupsWithBots() {
  console.log('🤖 Creating groups and adding bots\n');
  
  const client = new WAHAClient(
    process.env.WAHA_BASE_URL,
    process.env.WAHA_API_KEY
  );

  const botSessions = ['bot10', 'bot11', 'bot12'];
  const groups = [
    { name: 'קבוצת טסט 1', session: 'bot10' },
    { name: 'קבוצת טסט 2', session: 'bot11' },
    { name: 'קבוצת טסט 3', session: 'bot12' }
  ];

  const results = [];

  try {
    // Get bot phone numbers
    console.log('📱 Getting bot phone numbers...\n');
    const botPhones = {};
    
    for (const session of botSessions) {
      const me = await client.getSessionMe(session);
      botPhones[session] = me.id;
      console.log(`✅ ${session}: ${me.pushName} (${me.id})`);
      await delay(2);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Create groups and add bots
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      console.log(`📝 Creating group ${i + 1}: ${group.name} (from ${group.session})\n`);

      try {
        // Prepare participants (other 2 bots)
        const otherBots = botSessions.filter(s => s !== group.session);
        const participants = otherBots.map(bot => botPhones[bot]);

        console.log(`   Adding participants: ${otherBots.join(', ')}`);
        console.log(`   Phone numbers: ${participants.join(', ')}`);

        // Create group
        const createdGroup = await client.createGroup(group.session, {
          name: group.name,
          participants: participants
        });

        console.log(`   ✅ Group created: ${createdGroup.id}`);

        // Wait before getting invite code
        await delay(90); // 1.5 minutes

        // Get invite code
        console.log(`   📎 Getting invite code...`);
        const inviteCode = await client.getGroupInviteCode(group.session, createdGroup.id);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
        
        console.log(`   ✅ Invite link: ${inviteLink}`);

        results.push({
          groupName: group.name,
          groupId: createdGroup.id,
          creator: group.session,
          inviteLink: inviteLink,
          participants: otherBots
        });

        console.log(`   ⏳ Waiting 2 minutes before next group...\n`);
        await delay(120); // 2 minutes

        console.log('='.repeat(60) + '\n');

      } catch (error) {
        console.error(`   ❌ Error creating group ${group.name}:`, error.message);
        console.log(`   ⏳ Waiting 2 minutes before retry...\n`);
        await delay(120);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Summary - Groups Created:\n');
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.groupName}`);
      console.log(`   Created by: ${result.creator}`);
      console.log(`   Members: ${result.participants.join(', ')}`);
      console.log(`   Group ID: ${result.groupId}`);
      console.log(`   Invite Link: ${result.inviteLink}`);
      console.log();
    });

    console.log('='.repeat(60));
    console.log('\n✅ All groups created successfully!\n');

    // Save to file
    const fs = await import('fs');
    const resultText = results.map((r, i) => 
      `${i + 1}. ${r.groupName}\n   Link: ${r.inviteLink}\n   ID: ${r.groupId}\n   Creator: ${r.creator}\n   Members: ${r.participants.join(', ')}\n`
    ).join('\n');
    
    fs.writeFileSync('groups_created.txt', resultText);
    console.log('💾 Results saved to groups_created.txt\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

createGroupsWithBots();
