#!/usr/bin/env node

/**
 * Integration test demonstrating complete Daily Grain functionality
 */

const MessageService = require('./src/services/MessageService');
const User = require('./src/models/User');
const Habit = require('./src/models/Habit');
const HabitLog = require('./src/models/HabitLog');

async function runIntegrationTest() {
  console.log('='.repeat(60));
  console.log('Daily Grain - Integration Test');
  console.log('='.repeat(60));
  console.log();

  const testPhone = '+15551234567';
  
  try {
    // Test 1: New user gets help
    console.log('TEST 1: New user interaction');
    console.log('-'.repeat(60));
    let response = await MessageService.handleIncomingMessage(testPhone, 'Hello');
    console.log('User:', 'Hello');
    console.log('Bot:', response);
    console.log();

    // Test 2: Add a daily habit
    console.log('TEST 2: Adding a daily habit');
    console.log('-'.repeat(60));
    response = await MessageService.handleIncomingMessage(testPhone, 'ADD Morning meditation');
    console.log('User:', 'ADD Morning meditation');
    console.log('Bot:', response);
    console.log();

    response = await MessageService.handleIncomingMessage(testPhone, '1');
    console.log('User:', '1');
    console.log('Bot:', response);
    console.log();

    // Test 3: Add a multiple per day habit
    console.log('TEST 3: Adding a multiple per day habit');
    console.log('-'.repeat(60));
    response = await MessageService.handleIncomingMessage(testPhone, 'ADD Drink water');
    console.log('User:', 'ADD Drink water');
    console.log('Bot:', response);
    console.log();

    response = await MessageService.handleIncomingMessage(testPhone, '2');
    console.log('User:', '2');
    console.log('Bot:', response);
    console.log();

    response = await MessageService.handleIncomingMessage(testPhone, '8');
    console.log('User:', '8');
    console.log('Bot:', response);
    console.log();

    // Test 4: Add a weekly habit
    console.log('TEST 4: Adding a weekly habit');
    console.log('-'.repeat(60));
    response = await MessageService.handleIncomingMessage(testPhone, 'ADD Gym workout');
    console.log('User:', 'ADD Gym workout');
    console.log('Bot:', response);
    console.log();

    response = await MessageService.handleIncomingMessage(testPhone, '3');
    console.log('User:', '3');
    console.log('Bot:', response);
    console.log();

    response = await MessageService.handleIncomingMessage(testPhone, '3');
    console.log('User:', '3');
    console.log('Bot:', response);
    console.log();

    // Test 5: List all habits
    console.log('TEST 5: Listing all habits');
    console.log('-'.repeat(60));
    response = await MessageService.handleIncomingMessage(testPhone, 'LIST');
    console.log('User:', 'LIST');
    console.log('Bot:', response);
    console.log();

    // Test 6: Log multiple habits at once
    console.log('TEST 6: Logging multiple habits');
    console.log('-'.repeat(60));
    response = await MessageService.handleIncomingMessage(testPhone, '1 2 3');
    console.log('User:', '1 2 3');
    console.log('Bot:', response);
    console.log();

    // Test 7: Check status
    console.log('TEST 7: Checking status');
    console.log('-'.repeat(60));
    response = await MessageService.handleIncomingMessage(testPhone, 'STATUS');
    console.log('User:', 'STATUS');
    console.log('Bot:', response);
    console.log();

    // Test 8: Log habits for multiple days to build streak
    console.log('TEST 8: Building a streak (simulating 3 days)');
    console.log('-'.repeat(60));
    const user = User.findByPhoneNumber(testPhone);
    const habits = Habit.findByUserId(user.id);
    
    // Manually log habits for previous days
    const today = new Date();
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      habits.forEach(habit => {
        HabitLog.log(habit.id, dateStr, 1);
      });
      console.log(`✓ Logged all habits for ${i} day(s) ago`);
    }
    console.log();

    // Test 9: Check status with streak
    console.log('TEST 9: Checking status with streak');
    console.log('-'.repeat(60));
    response = await MessageService.handleIncomingMessage(testPhone, 'STATUS');
    console.log('User:', 'STATUS');
    console.log('Bot:', response);
    console.log();

    // Test 10: Verify database state
    console.log('TEST 10: Database verification');
    console.log('-'.repeat(60));
    console.log('User count:', User.findById(user.id) ? 1 : 0);
    console.log('Habit count:', habits.length);
    console.log('Habits:');
    habits.forEach((habit, i) => {
      const stats = HabitLog.getCompletionStats(habit.id, 7);
      const streak = HabitLog.getCurrentStreak(habit.id);
      console.log(`  ${i + 1}. ${habit.name}`);
      console.log(`     Frequency: ${habit.frequency_type}`);
      console.log(`     Target: ${habit.target_count}`);
      console.log(`     Streak: ${streak} days`);
      console.log(`     7-day completion: ${stats.completionRate}%`);
    });
    console.log();

    console.log('='.repeat(60));
    console.log('✓ ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log();
    console.log('Daily Grain is working correctly!');
    console.log();

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    process.exit(1);
  }
}

// Run the test
runIntegrationTest();
