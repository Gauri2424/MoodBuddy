import { query } from '../database/db.js';

/**
 * Helper to calculate consecutive day streak based on mood entries
 */
const calculateStreak = (datesArray) => {
  if (datesArray.length === 0) return 0;

  // Convert dates to local ISO date string format (YYYY-MM-DD) and remove duplicates
  const localDates = [...new Set(
    datesArray.map(date => new Date(date).toLocaleDateString('en-CA')) // en-CA format returns YYYY-MM-DD
  )].sort((a, b) => new Date(b) - new Date(a)); // Sort descending (latest first)

  if (localDates.length === 0) return 0;

  const todayStr = new Date().toLocaleDateString('en-CA');
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');

  const latestCheckIn = localDates[0];

  // If the last check-in was not today and not yesterday, streak is reset to 0
  if (latestCheckIn !== todayStr && latestCheckIn !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < localDates.length - 1; i++) {
    const currentDate = new Date(localDates[i]);
    const nextDate = new Date(localDates[i + 1]);
    
    // Calculate difference in days
    const diffTime = Math.abs(currentDate - nextDate);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      break; // Streak broken
    }
  }

  return streak;
};

/**
 * Fetches user profile along with calculated statistics (streak, check-ins, join date)
 */
export const getProfile = async (req, res, next) => {
  try {
    // 1. Get profile details (always row 1)
    const profileResult = await query('SELECT id, name, avatar, created_at as "createdAt" FROM user_profiles LIMIT 1');
    
    let userProfile = profileResult.rows[0];

    // Fallback if db has no profile seeded
    if (!userProfile) {
      const seedResult = await query(
        "INSERT INTO user_profiles (name, avatar) VALUES ($1, $2) RETURNING id, name, avatar, created_at as 'createdAt'",
        ['Buddy', '🦊']
      );
      userProfile = seedResult.rows[0];
    }

    // 2. Fetch all check-in dates to calculate total counts and streak
    const datesResult = await query('SELECT created_at FROM mood_entries ORDER BY created_at DESC');
    const checkInDates = datesResult.rows.map(row => row.created_at);

    const totalCheckIns = checkInDates.length;
    const streak = calculateStreak(checkInDates);

    res.status(200).json({
      success: true,
      profile: {
        id: userProfile.id,
        name: userProfile.name,
        avatar: userProfile.avatar,
        createdAt: userProfile.createdAt,
        totalCheckIns,
        streak,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the user's profile username and avatar
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    // Get current profile
    const profileResult = await query('SELECT id FROM user_profiles LIMIT 1');
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    const profileId = profileResult.rows[0].id;

    // Update profile in DB using SQL
    const updateResult = await query(
      `UPDATE user_profiles 
       SET name = COALESCE($1, name), 
           avatar = COALESCE($2, avatar)
       WHERE id = $3
       RETURNING id, name, avatar, created_at as "createdAt"`,
      [name, avatar, profileId]
    );

    const updatedProfile = updateResult.rows[0];

    // Re-fetch check-in dates for statistics calculations
    const datesResult = await query('SELECT created_at FROM mood_entries ORDER BY created_at DESC');
    const checkInDates = datesResult.rows.map(row => row.created_at);
    
    res.status(200).json({
      success: true,
      profile: {
        id: updatedProfile.id,
        name: updatedProfile.name,
        avatar: updatedProfile.avatar,
        createdAt: updatedProfile.createdAt,
        totalCheckIns: checkInDates.length,
        streak: calculateStreak(checkInDates),
      },
    });
  } catch (error) {
    next(error);
  }
};
