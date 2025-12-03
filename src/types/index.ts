export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    monthly_income: number;
    total_budget: number;
    savings_goal: number;
    current_savings: number;
}

export interface Category {
    id: string;
    user_id: string;
    name: string;
    limit: number;
    spent: number;
    color: string;
}

export interface Expense {
    id: string;
    user_id: string;
    amount: number;
    category: string;
    category_color: string;
    date: string;
    notes: string;
}
