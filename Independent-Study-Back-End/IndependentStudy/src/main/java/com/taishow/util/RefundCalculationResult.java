package com.taishow.util;

public class RefundCalculationResult {
    private final boolean isReturnBonus;
    private final int bonusEquivalentAmount;

    public RefundCalculationResult(boolean isReturnBonus, int bonusEquivalentAmount) {
        this.isReturnBonus = isReturnBonus;
        this.bonusEquivalentAmount = bonusEquivalentAmount;
    }

    public boolean isReturnBonus() {
        return isReturnBonus;
    }

    public int getBonusEquivalentAmount() {
        return bonusEquivalentAmount;
    }
}
