
import { Transaction } from "../types";

export interface InsightResult {
  summary: string;
  warnings: string[];
  recommendations: string[];
  riskLevel: "Low" | "Medium" | "High";
}

export interface CategoryData {
  category: string;
  totalAmount: number;
  percentage: number;
}

/**
 * Generates intelligent financial insights based on current metrics and historical data.
 */
export function generateFinancialInsights(
  income: number,
  expenses: number,
  budgetLimit: number,
  categoryBreakdown: CategoryData[],
  previousMonthData?: { income: number; expenses: number }
): InsightResult {
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const budgetUsage = budgetLimit > 0 ? (expenses / budgetLimit) * 100 : 0;
  
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  let summaryParts: string[] = [];

  // 1. Savings Rate Analysis
  if (savingsRate < 10) {
    warnings.push("Your savings rate is below the healthy 10% threshold. Consider reviewing non-essential subscriptions or lifestyle costs.");
  } else if (savingsRate >= 30) {
    summaryParts.push("You're doing an incredible job saving over 30% of your income!");
  } else {
    summaryParts.push("Your savings rate is steady and healthy.");
  }

  // 2. Budget Usage & Risk Assessment
  if (budgetLimit > 0) {
    if (expenses > budgetLimit) {
      riskLevel = "High";
      warnings.push(`Critical: You have exceeded your budget limit by ${new Intl.NumberFormat().format(expenses - budgetLimit)} MMK.`);
    } else if (budgetUsage > 90) {
      riskLevel = "Medium";
      warnings.push("You are approaching your budget limit. Only 10% of your allocated budget remains.");
    }
  }

  // 3. Category Analysis
  const highestCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;
  if (highestCategory && highestCategory.percentage > 50) {
    recommendations.push(`High Concentration: Over 50% of your spending is in "${highestCategory.category}". Explore ways to optimize this specific area.`);
  }

  // 4. Historical Comparison
  if (previousMonthData) {
    const prevSavings = previousMonthData.income - previousMonthData.expenses;
    if (savings > prevSavings) {
      summaryParts.push("Great progress! You saved more this month compared to last month.");
    } else if (savings < prevSavings && savingsRate < 20) {
      warnings.push("Your total savings have decreased since last month. Watch out for creeping expenses.");
    }
  } else {
    summaryParts.push("Keep tracking to see month-over-month growth trends.");
  }

  // 5. General Recommendations
  if (riskLevel === "High") {
    recommendations.push("Immediate action required: Halt all non-essential spending for the remainder of the period.");
  }
  if (savingsRate >= 20 && riskLevel === "Low") {
    recommendations.push("With your surplus, consider increasing your investment contributions or building your emergency fund.");
  }

  return {
    summary: summaryParts.join(" "),
    warnings,
    recommendations,
    riskLevel
  };
}
