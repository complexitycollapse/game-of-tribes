# Game of Tribes

This is a simulator for the iterated prisoner's dilemma game. What makes it different is that rather than having many bots trying to win the game as individuals, they are instead divided into "tribes", and the goal is to maximize the total score of the tribe rather than the individual.

## Any Interesting Results?

Here's one. Consider the following strategies:

 - Tit-for-tat - the traditional tit-for-tat strategy, where you cooperate on the first turn and next time play whatever your opponent played in the last round
 - In-group preference - cooperate with members of your tribe, and defect against all others.

 Which is the superior strategy when they are pitted again each other? It depends on the numbers. When tit-for-tat is the majority, it is the most successful strategy. But when in-group preference is the majority, it will beat tit-for-tat. If they are equal, in-group preference is slightly prefered. This is similar to the well-known result for tit-for-tat vs. always defect in the non-tribal game - tit-for-tat wins unless it is heavily outnumbered by defect. The difference is that in-group preference can beat tit-for-tat even when the numbers are merely equal, making it a superior strategy to always defect in the tribal game.

 Another (unsurprising) result is that a strategy of out-group preference (defect from your own tribe, cooperate with others) is an abysmal strategy in all cases.
