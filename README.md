# game-of-life

Rule:

1. Cannon damages and impacts will be calculated first.
2. Cannon can destroy viliages and unavailable cannons around once when available.
3. Available cannons cannot be destroyed and will be available in this round.
4. If cannon and villiage are overlapping, cannon will be in unavailable state. It can live to next round and when no overlapping, it turns to available state.
5. Cells can be overlapping as well. Overlapped cells will be both dead.
6. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
7. Any live cell with two or three live neighbors lives on to the next generation.
8. Any live cell with more than three live neighbors dies, as if by overpopulation.
9. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
