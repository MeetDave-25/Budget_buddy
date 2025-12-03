// Badge and Streak Calculation Utilities

export interface BadgeDefinition {
    id: string;
    name: string;
    description: string;
    icon: string;
    criteria: (data: any) => boolean;
}

// Define all available badges
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
    {
        id: 'first_step',
        name: '🎯 First Step',
        description: 'Added your first expense',
        icon: '🎯',
        criteria: (data) => data.totalExpenses >= 1,
    },
    {
        id: 'tracker_pro',
        name: '📊 Tracker Pro',
        description: 'Logged 30+ expenses',
        icon: '📊',
        criteria: (data) => data.totalExpenses >= 30,
    },
    {
        id: 'budget_master',
        name: '💰 Budget Master',
        description: 'Stayed under budget',
        icon: '💰',
        criteria: (data) => data.spent < data.totalBudget && data.totalExpenses >= 5,
    },
    {
        id: 'saver',
        name: '💎 Saver',
        description: 'Used less than 80% of budget',
        icon: '💎',
        criteria: (data) => {
            const percentage = (data.spent / data.totalBudget) * 100;
            return percentage < 80 && data.totalExpenses >= 5;
        },
    },
    {
        id: 'streak_king',
        name: '🔥 Streak King',
        description: '7-day tracking streak',
        icon: '🔥',
        criteria: (data) => data.currentStreak >= 7,
    },
    {
        id: 'streak_legend',
        name: '⚡ Streak Legend',
        description: '30-day tracking streak',
        icon: '⚡',
        criteria: (data) => data.currentStreak >= 30,
    },
];

/**
 * Calculate which badges a user has earned
 */
export function calculateBadges(userData: {
    totalExpenses: number;
    spent: number;
    totalBudget: number;
    currentStreak: number;
}): string[] {
    const earnedBadges: string[] = [];

    for (const badge of BADGE_DEFINITIONS) {
        if (badge.criteria(userData)) {
            earnedBadges.push(badge.name);
        }
    }

    return earnedBadges;
}

/**
 * Calculate current streak based on expense dates
 */
export function calculateStreak(expenses: any[]): {
    currentStreak: number;
    longestStreak: number;
    lastExpenseDate: string | null;
} {
    if (!expenses || expenses.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastExpenseDate: null,
        };
    }

    // Sort expenses by date (most recent first)
    const sortedExpenses = [...expenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const lastExpenseDate = sortedExpenses[0].date;

    // Get unique dates (one expense per day counts)
    const uniqueDates = Array.from(
        new Set(sortedExpenses.map((exp) => exp.date))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        currentDate.setHours(0, 0, 0, 0);

        if (i === 0) {
            // Check if last expense was today or yesterday
            const daysDiff = Math.floor(
                (today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysDiff <= 1) {
                tempStreak = 1;
                currentStreak = 1;
            } else {
                // Streak is broken
                currentStreak = 0;
                tempStreak = 1;
            }
        } else {
            const prevDate = new Date(uniqueDates[i - 1]);
            prevDate.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor(
                (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysDiff === 1) {
                // Consecutive day
                tempStreak++;
                if (currentStreak > 0) {
                    currentStreak++;
                }
            } else {
                // Gap in dates, reset temp streak
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }

        longestStreak = Math.max(longestStreak, tempStreak);
    }

    return {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        lastExpenseDate,
    };
}
