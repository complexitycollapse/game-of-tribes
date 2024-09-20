# Game of Tribes

This is a simulator for the iterated prisoner's dilemma game. What makes it different is that rather than having many bots trying to win the game as individuals, they are instead divided into "tribes", and the goal is to maximize the total score of the tribe rather than the individual.

## Any Interesting Results?

Here's one. Consider the following strategies:

 - Tit-for-tat - the traditional tit-for-tat strategy, where you cooperate on the first turn and next time play whatever your opponent played in the last round
 - War - cooperate with members of your tribe, and defect against all others

 Which is the superior strategy when they are pitted again each other? It depends on the numbers. When tit-for-tat is the majority, it is the most successful strategy. But when war is the majority, it will beat tit-for-tat. If they are equal, war is slightly prefered. This is similar to the well-known result for tit-for-tat vs. always-defect in the non-tribal game - tit-for-tat wins unless it is heavily outnumbered by always-defect. The difference is that war can beat tit-for-tat even when the numbers are merely equal, making it a superior strategy to always-defect and equal to tit-for-tat.

 Another (unsurprising) result is that a strategy of betrayal (defect from your own tribe, cooperate with others) is an abysmal strategy in all cases.

## Total Welfare

Another interesting question to ask how the "total welfare" (sum of scores for all bots) differs depending on the strategies used.

Tit-for-tat and war both produce very high values when they play on their own, as they will always co-operate each time. But if there is an even split between tit-for-tat and war then the total welfare is halved. This is also the case when two different tribes that both use the war algorithm are pitted against each other.

In both scenarios, the worst case is when the tribes are of equal size. As one tribe (regardless of strategy) begins to dominate the numbers, welfare increases. Welfare is further decreased as the number of tribes increases.

I will leave it to you to draw conclusions.
