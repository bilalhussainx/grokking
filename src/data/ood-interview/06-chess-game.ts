import { Module } from "../types";

export const chessGameModule: Module = {
  id: "ood-chess",
  title: "Design a Chess Game",
  description: "Design an object-oriented chess game with board representation, piece hierarchy, move validation, check/checkmate detection, and game state management.",
  lessons: [
    {
      id: "ood-chess-1",
      slug: "chess-requirements",
      title: "Chess Game: Requirements",
      content: `# Chess Game: Requirements

## Problem Statement

Design a Chess Game that supports two players, validates legal moves for all piece types, detects check and checkmate, and tracks game state.

## Clarifying Questions & Answers

**Q: Who are the actors?**
- **Player (White)** -- Makes moves, can resign or offer draw
- **Player (Black)** -- Makes moves, can resign or accept/decline draw
- **System** -- Validates moves, detects check/checkmate, enforces turn order

**Q: What are the core use cases?**
1. Initialize a new game with standard piece placement
2. Move a piece from one square to another
3. Validate whether a move is legal
4. Detect check (king is under attack)
5. Detect checkmate (no legal moves to escape check)
6. Detect stalemate (no legal moves but not in check)
7. Handle special moves: castling, en passant, pawn promotion
8. Track captured pieces
9. Allow resignation and draw offers

**Q: What are the constraints?**
- Standard 8x8 board
- Standard chess rules
- Two players, alternating turns
- A move is illegal if it leaves your own king in check
- Game ends on checkmate, stalemate, resignation, or agreed draw

**Q: What scope to focus on?**
For the interview, let us implement:
- Board with all piece types
- Move validation for each piece
- Basic check detection
- Turn management
- We will note castling, en passant, and promotion as extensions

## Key Entities

\`\`\`
+-------------------+     +-------------------+
|     Player        |     |      Game         |
+-------------------+     +-------------------+
| - Make move       |     | - Initialize      |
| - Resign          |     | - Validate moves  |
| - Offer draw      |     | - Detect check    |
+-------------------+     | - Detect checkmate|
                          | - Manage turns    |
                          +-------------------+
\`\`\`

Core classes:
- **Game** -- Manages the game lifecycle, turn order, and win conditions
- **Board** -- 8x8 grid of squares, tracks piece positions
- **Square** -- A position on the board (row, col), may contain a piece
- **Piece** (abstract) -- Base class for all pieces
  - **King, Queen, Rook, Bishop, Knight, Pawn** -- Concrete piece types
- **Player** -- Color, captured pieces, active status
- **Move** -- From square, to square, piece moved, piece captured

## Piece Movement Rules

| Piece | Movement |
|-------|----------|
| King | One square in any direction |
| Queen | Any number of squares horizontally, vertically, or diagonally |
| Rook | Any number of squares horizontally or vertically |
| Bishop | Any number of squares diagonally |
| Knight | L-shape: 2+1 squares, can jump over pieces |
| Pawn | Forward one (or two from start), captures diagonally |
`,
    },
    {
      id: "ood-chess-2",
      slug: "chess-class-diagram",
      title: "Chess Game: Class Diagram",
      content: `# Chess Game: Class Diagram

## Core Classes and Relationships

\`\`\`
+---------------------+
|      Color          |
|  <<enumeration>>    |
+---------------------+
| WHITE               |
| BLACK               |
+---------------------+

+---------------------+
|    GameStatus       |
|  <<enumeration>>    |
+---------------------+
| ACTIVE              |
| WHITE_WINS          |
| BLACK_WINS          |
| STALEMATE           |
| DRAW                |
+---------------------+

+-------------------+
|   Piece (ABC)     |
+-------------------+
| - color: Color    |
| - is_alive: bool  |
+-------------------+
| + can_move(board, |
|   start, end)     |
| + get_symbol()    |
+-------------------+
       ^
       |
  +----+----+----+----+----+----+
  |    |    |    |    |    |    |
King Queen Rook Bishop Knight Pawn

+-------------------+         +-------------------+
|      Board        |         |     Square        |
+-------------------+  8x8   +-------------------+
| - grid: Square[][]|--------| - row: int        |
| - size: int       |        | - col: int        |
+-------------------+        | - piece: Piece    |
| + get_square()    |        +-------------------+
| + move_piece()    |        | + is_empty()      |
| + is_in_check()   |        | + place_piece()   |
| + is_checkmate()  |        | + remove_piece()  |
| + initialize()    |        +-------------------+
+-------------------+

+-------------------+         +-------------------+
|      Game         |         |     Player        |
+-------------------+  2    1 +-------------------+
| - board: Board    |---------| - color: Color    |
| - players: list   |         | - name: str       |
| - current_turn:   |         | - captured: list  |
|   Player          |         +-------------------+
| - status: Status  |
| - move_history:   |
|   list[Move]      |
+-------------------+
| + make_move()     |
| + is_valid_move() |
| + switch_turn()   |
| + get_status()    |
+-------------------+

+-------------------+
|      Move         |
+-------------------+
| - piece: Piece    |
| - start: Square   |
| - end: Square     |
| - captured: Piece |
| - timestamp: dt   |
+-------------------+
\`\`\`

## Relationship Details

### Composition
- **Board *--- Square**: The board is composed of 64 squares
- **Game *--- Board**: The game owns the board

### Inheritance
- **Piece <|-- King, Queen, Rook, Bishop, Knight, Pawn**: Each piece type implements its own movement rules via \`can_move()\`

### Association
- **Square --> Piece**: A square may hold one piece
- **Game --> Player**: A game has exactly two players
- **Move --> Piece, Square**: A move records what moved where

## Design Decisions

1. **Piece as abstract class**: Each piece type overrides \`can_move()\` with its specific movement rules. This is a textbook use of **polymorphism** -- the Board calls \`piece.can_move()\` without knowing the concrete type.

2. **Square as separate class**: Rather than using raw (row, col) tuples, Square encapsulates position and can hold a piece. This simplifies board queries.

3. **Move as a record**: Storing moves enables undo, replay, and move history display. It also supports detecting draw by repetition (same position three times).

4. **Board handles check detection**: The Board knows all piece positions and can determine if a king is under attack. This keeps the check logic centralized.
`,
    },
    {
      id: "ood-chess-3",
      slug: "chess-implementation",
      title: "Chess Game: Implementation",
      content: `# Chess Game: Implementation

Implement the chess game with a board, piece hierarchy, move validation, and check detection.

## Implementation Goals

- 8x8 board with standard piece placement
- Each piece type validates its own moves
- Board detects check and checkmate
- Game manages turns and enforces rules
`,
      starterCode: `from abc import ABC, abstractmethod
from enum import Enum
from typing import Optional
from datetime import datetime


class Color(Enum):
    WHITE = "white"
    BLACK = "black"


class GameStatus(Enum):
    ACTIVE = "active"
    WHITE_WINS = "white_wins"
    BLACK_WINS = "black_wins"
    STALEMATE = "stalemate"
    DRAW = "draw"


class Piece(ABC):
    def __init__(self, color: Color):
        self.color = color
        self.is_alive = True
        self.has_moved = False

    @abstractmethod
    def can_move(self, board: "Board", start_row: int, start_col: int,
                 end_row: int, end_col: int) -> bool:
        pass

    @abstractmethod
    def get_symbol(self) -> str:
        pass

    def __repr__(self):
        return f"{self.get_symbol()}"


class King(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        # TODO: King moves one square in any direction
        pass

    def get_symbol(self):
        return "K" if self.color == Color.WHITE else "k"


class Queen(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        # TODO: Queen moves like rook + bishop combined
        pass

    def get_symbol(self):
        return "Q" if self.color == Color.WHITE else "q"


class Rook(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        # TODO: Rook moves horizontally or vertically, no jumping
        pass

    def get_symbol(self):
        return "R" if self.color == Color.WHITE else "r"


class Bishop(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        # TODO: Bishop moves diagonally, no jumping
        pass

    def get_symbol(self):
        return "B" if self.color == Color.WHITE else "b"


class Knight(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        # TODO: Knight moves in L-shape (2+1), can jump
        pass

    def get_symbol(self):
        return "N" if self.color == Color.WHITE else "n"


class Pawn(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        # TODO: Pawn moves forward 1 (or 2 from start), captures diagonally
        pass

    def get_symbol(self):
        return "P" if self.color == Color.WHITE else "p"


class Square:
    def __init__(self, row: int, col: int):
        self.row = row
        self.col = col
        self.piece: Optional[Piece] = None

    def is_empty(self) -> bool:
        return self.piece is None

    def place_piece(self, piece: Piece):
        self.piece = piece

    def remove_piece(self) -> Optional[Piece]:
        piece = self.piece
        self.piece = None
        return piece


class Board:
    SIZE = 8

    def __init__(self):
        self.grid: list[list[Square]] = [
            [Square(r, c) for c in range(self.SIZE)] for r in range(self.SIZE)
        ]

    def get_square(self, row: int, col: int) -> Square:
        return self.grid[row][col]

    def get_piece(self, row: int, col: int) -> Optional[Piece]:
        return self.grid[row][col].piece

    def is_valid_position(self, row: int, col: int) -> bool:
        return 0 <= row < self.SIZE and 0 <= col < self.SIZE

    def is_path_clear(self, start_row, start_col, end_row, end_col) -> bool:
        # TODO: Check if path between start and end is clear (for rook, bishop, queen)
        # Does NOT check the destination square
        pass

    def initialize(self):
        # TODO: Place all pieces in standard starting positions
        pass

    def move_piece(self, start_row, start_col, end_row, end_col) -> Optional[Piece]:
        # TODO: Move piece from start to end, return captured piece if any
        pass

    def find_king(self, color: Color) -> tuple[int, int]:
        # TODO: Find the position of the king of given color
        pass

    def is_in_check(self, color: Color) -> bool:
        # TODO: Return True if the king of given color is under attack
        pass

    def display(self):
        # TODO: Print the board
        pass


class Move:
    def __init__(self, piece: Piece, start: tuple[int, int], end: tuple[int, int],
                 captured: Optional[Piece] = None):
        self.piece = piece
        self.start = start
        self.end = end
        self.captured = captured
        self.timestamp = datetime.now()


class Player:
    def __init__(self, name: str, color: Color):
        self.name = name
        self.color = color
        self.captured_pieces: list[Piece] = []


class Game:
    def __init__(self, player1_name: str, player2_name: str):
        self.board = Board()
        self.board.initialize()
        self.players = [
            Player(player1_name, Color.WHITE),
            Player(player2_name, Color.BLACK),
        ]
        self.current_turn = 0  # Index into players
        self.status = GameStatus.ACTIVE
        self.move_history: list[Move] = []

    def get_current_player(self) -> Player:
        return self.players[self.current_turn]

    def make_move(self, start_row, start_col, end_row, end_col) -> bool:
        # TODO: Validate move, execute it, check for check/checkmate, switch turn
        pass

    def switch_turn(self):
        self.current_turn = 1 - self.current_turn

    def resign(self):
        # TODO: Current player resigns
        pass


# Test the system
if __name__ == "__main__":
    game = Game("Alice", "Bob")
    game.board.display()
`,
      solutionCode: `from abc import ABC, abstractmethod
from enum import Enum
from typing import Optional
from datetime import datetime


class Color(Enum):
    WHITE = "white"
    BLACK = "black"


class GameStatus(Enum):
    ACTIVE = "active"
    WHITE_WINS = "white_wins"
    BLACK_WINS = "black_wins"
    STALEMATE = "stalemate"
    DRAW = "draw"


class Piece(ABC):
    def __init__(self, color: Color):
        self.color = color
        self.is_alive = True
        self.has_moved = False

    @abstractmethod
    def can_move(self, board: "Board", start_row: int, start_col: int,
                 end_row: int, end_col: int) -> bool:
        pass

    @abstractmethod
    def get_symbol(self) -> str:
        pass

    def __repr__(self):
        return f"{self.get_symbol()}"


class King(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        row_diff = abs(end_row - start_row)
        col_diff = abs(end_col - start_col)
        if row_diff <= 1 and col_diff <= 1 and (row_diff + col_diff > 0):
            target = board.get_piece(end_row, end_col)
            return target is None or target.color != self.color
        return False

    def get_symbol(self):
        return "K" if self.color == Color.WHITE else "k"


class Queen(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        # Queen = Rook + Bishop movement
        row_diff = abs(end_row - start_row)
        col_diff = abs(end_col - start_col)
        is_straight = (start_row == end_row or start_col == end_col)
        is_diagonal = (row_diff == col_diff)
        if not (is_straight or is_diagonal):
            return False
        if not board.is_path_clear(start_row, start_col, end_row, end_col):
            return False
        target = board.get_piece(end_row, end_col)
        return target is None or target.color != self.color

    def get_symbol(self):
        return "Q" if self.color == Color.WHITE else "q"


class Rook(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        if start_row != end_row and start_col != end_col:
            return False
        if not board.is_path_clear(start_row, start_col, end_row, end_col):
            return False
        target = board.get_piece(end_row, end_col)
        return target is None or target.color != self.color

    def get_symbol(self):
        return "R" if self.color == Color.WHITE else "r"


class Bishop(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        row_diff = abs(end_row - start_row)
        col_diff = abs(end_col - start_col)
        if row_diff != col_diff or row_diff == 0:
            return False
        if not board.is_path_clear(start_row, start_col, end_row, end_col):
            return False
        target = board.get_piece(end_row, end_col)
        return target is None or target.color != self.color

    def get_symbol(self):
        return "B" if self.color == Color.WHITE else "b"


class Knight(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        row_diff = abs(end_row - start_row)
        col_diff = abs(end_col - start_col)
        if not ((row_diff == 2 and col_diff == 1) or (row_diff == 1 and col_diff == 2)):
            return False
        target = board.get_piece(end_row, end_col)
        return target is None or target.color != self.color

    def get_symbol(self):
        return "N" if self.color == Color.WHITE else "n"


class Pawn(Piece):
    def can_move(self, board, start_row, start_col, end_row, end_col):
        direction = -1 if self.color == Color.WHITE else 1
        start_rank = 6 if self.color == Color.WHITE else 1

        row_diff = end_row - start_row
        col_diff = abs(end_col - start_col)

        # Move forward one square
        if col_diff == 0 and row_diff == direction:
            return board.get_piece(end_row, end_col) is None

        # Move forward two squares from starting position
        if col_diff == 0 and row_diff == 2 * direction and start_row == start_rank:
            mid_row = start_row + direction
            return (board.get_piece(mid_row, start_col) is None and
                    board.get_piece(end_row, end_col) is None)

        # Capture diagonally
        if col_diff == 1 and row_diff == direction:
            target = board.get_piece(end_row, end_col)
            return target is not None and target.color != self.color

        return False

    def get_symbol(self):
        return "P" if self.color == Color.WHITE else "p"


class Square:
    def __init__(self, row: int, col: int):
        self.row = row
        self.col = col
        self.piece: Optional[Piece] = None

    def is_empty(self) -> bool:
        return self.piece is None

    def place_piece(self, piece: Piece):
        self.piece = piece

    def remove_piece(self) -> Optional[Piece]:
        piece = self.piece
        self.piece = None
        return piece


class Board:
    SIZE = 8

    def __init__(self):
        self.grid: list[list[Square]] = [
            [Square(r, c) for c in range(self.SIZE)] for r in range(self.SIZE)
        ]

    def get_square(self, row: int, col: int) -> Square:
        return self.grid[row][col]

    def get_piece(self, row: int, col: int) -> Optional[Piece]:
        return self.grid[row][col].piece

    def is_valid_position(self, row: int, col: int) -> bool:
        return 0 <= row < self.SIZE and 0 <= col < self.SIZE

    def is_path_clear(self, start_row, start_col, end_row, end_col) -> bool:
        row_step = 0 if end_row == start_row else (1 if end_row > start_row else -1)
        col_step = 0 if end_col == start_col else (1 if end_col > start_col else -1)
        r, c = start_row + row_step, start_col + col_step
        while (r, c) != (end_row, end_col):
            if self.grid[r][c].piece is not None:
                return False
            r += row_step
            c += col_step
        return True

    def initialize(self):
        # Place pawns
        for col in range(self.SIZE):
            self.grid[6][col].place_piece(Pawn(Color.WHITE))
            self.grid[1][col].place_piece(Pawn(Color.BLACK))

        # Place rooks
        self.grid[7][0].place_piece(Rook(Color.WHITE))
        self.grid[7][7].place_piece(Rook(Color.WHITE))
        self.grid[0][0].place_piece(Rook(Color.BLACK))
        self.grid[0][7].place_piece(Rook(Color.BLACK))

        # Place knights
        self.grid[7][1].place_piece(Knight(Color.WHITE))
        self.grid[7][6].place_piece(Knight(Color.WHITE))
        self.grid[0][1].place_piece(Knight(Color.BLACK))
        self.grid[0][6].place_piece(Knight(Color.BLACK))

        # Place bishops
        self.grid[7][2].place_piece(Bishop(Color.WHITE))
        self.grid[7][5].place_piece(Bishop(Color.WHITE))
        self.grid[0][2].place_piece(Bishop(Color.BLACK))
        self.grid[0][5].place_piece(Bishop(Color.BLACK))

        # Place queens
        self.grid[7][3].place_piece(Queen(Color.WHITE))
        self.grid[0][3].place_piece(Queen(Color.BLACK))

        # Place kings
        self.grid[7][4].place_piece(King(Color.WHITE))
        self.grid[0][4].place_piece(King(Color.BLACK))

    def move_piece(self, start_row, start_col, end_row, end_col) -> Optional[Piece]:
        piece = self.grid[start_row][start_col].remove_piece()
        captured = self.grid[end_row][end_col].remove_piece()
        self.grid[end_row][end_col].place_piece(piece)
        piece.has_moved = True
        if captured:
            captured.is_alive = False
        return captured

    def find_king(self, color: Color) -> tuple[int, int]:
        for r in range(self.SIZE):
            for c in range(self.SIZE):
                piece = self.grid[r][c].piece
                if isinstance(piece, King) and piece.color == color:
                    return (r, c)
        raise ValueError(f"No {color.value} king found")

    def is_in_check(self, color: Color) -> bool:
        king_row, king_col = self.find_king(color)
        opponent = Color.BLACK if color == Color.WHITE else Color.WHITE
        for r in range(self.SIZE):
            for c in range(self.SIZE):
                piece = self.grid[r][c].piece
                if piece and piece.color == opponent:
                    if piece.can_move(self, r, c, king_row, king_col):
                        return True
        return False

    def has_any_legal_move(self, color: Color) -> bool:
        for r in range(self.SIZE):
            for c in range(self.SIZE):
                piece = self.grid[r][c].piece
                if piece and piece.color == color:
                    for er in range(self.SIZE):
                        for ec in range(self.SIZE):
                            if piece.can_move(self, r, c, er, ec):
                                # Try the move and check if it leaves king in check
                                captured = self.move_piece(r, c, er, ec)
                                in_check = self.is_in_check(color)
                                # Undo move
                                self.grid[r][c].place_piece(piece)
                                piece.has_moved = False  # simplified undo
                                end_piece = self.grid[er][ec].remove_piece()
                                if captured:
                                    self.grid[er][ec].place_piece(captured)
                                    captured.is_alive = True
                                if not in_check:
                                    return True
        return False

    def display(self):
        print("  a b c d e f g h")
        print("  +-+-+-+-+-+-+-+-+")
        for r in range(self.SIZE):
            row_str = f"{8 - r} "
            for c in range(self.SIZE):
                piece = self.grid[r][c].piece
                row_str += (piece.get_symbol() if piece else ".") + " "
            print(row_str + f"{8 - r}")
        print("  +-+-+-+-+-+-+-+-+")
        print("  a b c d e f g h")


class Move:
    def __init__(self, piece: Piece, start: tuple[int, int], end: tuple[int, int],
                 captured: Optional[Piece] = None):
        self.piece = piece
        self.start = start
        self.end = end
        self.captured = captured
        self.timestamp = datetime.now()

    def __repr__(self):
        cols = "abcdefgh"
        start_str = f"{cols[self.start[1]]}{8 - self.start[0]}"
        end_str = f"{cols[self.end[1]]}{8 - self.end[0]}"
        return f"{self.piece.get_symbol()}: {start_str} -> {end_str}"


class Player:
    def __init__(self, name: str, color: Color):
        self.name = name
        self.color = color
        self.captured_pieces: list[Piece] = []


class Game:
    def __init__(self, player1_name: str, player2_name: str):
        self.board = Board()
        self.board.initialize()
        self.players = [
            Player(player1_name, Color.WHITE),
            Player(player2_name, Color.BLACK),
        ]
        self.current_turn = 0
        self.status = GameStatus.ACTIVE
        self.move_history: list[Move] = []

    def get_current_player(self) -> Player:
        return self.players[self.current_turn]

    def make_move(self, start_row, start_col, end_row, end_col) -> bool:
        if self.status != GameStatus.ACTIVE:
            print("Game is over")
            return False

        player = self.get_current_player()
        piece = self.board.get_piece(start_row, start_col)

        if piece is None:
            print("No piece at starting position")
            return False
        if piece.color != player.color:
            print("Not your piece")
            return False
        if not self.board.is_valid_position(end_row, end_col):
            print("Invalid destination")
            return False
        if not piece.can_move(self.board, start_row, start_col, end_row, end_col):
            print("Illegal move for this piece")
            return False

        # Try the move
        captured = self.board.move_piece(start_row, start_col, end_row, end_col)

        # Check if move leaves own king in check (illegal)
        if self.board.is_in_check(player.color):
            # Undo the move
            self.board.grid[start_row][start_col].place_piece(piece)
            self.board.grid[end_row][end_col].remove_piece()
            if captured:
                self.board.grid[end_row][end_col].place_piece(captured)
                captured.is_alive = True
            print("Move would leave your king in check")
            return False

        # Record move
        move = Move(piece, (start_row, start_col), (end_row, end_col), captured)
        self.move_history.append(move)
        if captured:
            player.captured_pieces.append(captured)

        print(f"{player.name}: {move}")

        # Check opponent status
        opponent_color = Color.BLACK if player.color == Color.WHITE else Color.WHITE
        if self.board.is_in_check(opponent_color):
            if not self.board.has_any_legal_move(opponent_color):
                self.status = GameStatus.WHITE_WINS if player.color == Color.WHITE else GameStatus.BLACK_WINS
                print(f"Checkmate! {player.name} wins!")
            else:
                print("Check!")
        elif not self.board.has_any_legal_move(opponent_color):
            self.status = GameStatus.STALEMATE
            print("Stalemate! Game is a draw.")

        self.switch_turn()
        return True

    def switch_turn(self):
        self.current_turn = 1 - self.current_turn

    def resign(self):
        player = self.get_current_player()
        if player.color == Color.WHITE:
            self.status = GameStatus.BLACK_WINS
        else:
            self.status = GameStatus.WHITE_WINS
        print(f"{player.name} resigns")


# Test the system
if __name__ == "__main__":
    game = Game("Alice", "Bob")
    game.board.display()

    # Example moves (standard opening)
    game.make_move(6, 4, 4, 4)  # White: e2 -> e4
    game.make_move(1, 4, 3, 4)  # Black: e7 -> e5
    game.make_move(7, 6, 5, 5)  # White: Ng1 -> f3
    game.board.display()
`,
    },
    {
      id: "ood-chess-4",
      slug: "chess-move-validation",
      title: "Chess Game: Move Validation",
      content: `# Chess Game: Move Validation

Move validation is the heart of a chess engine. Each piece type has different rules, and additional constraints apply globally (cannot move into check). Let us break down the validation logic for each piece.

## The Validation Chain

When a player attempts a move, validation happens in layers:

\`\`\`
1. Basic checks (game active, correct turn, piece exists)
       |
2. Piece-specific movement rules (can_move)
       |
3. Path clearance (no pieces blocking for sliding pieces)
       |
4. Destination check (cannot capture own piece)
       |
5. King safety (move must not leave own king in check)
\`\`\`

## Piece-Specific Rules

### King
Moves exactly one square in any direction (8 possible destinations).

\`\`\`python
def can_move(self, board, sr, sc, er, ec):
    row_diff = abs(er - sr)
    col_diff = abs(ec - sc)
    if row_diff <= 1 and col_diff <= 1 and (row_diff + col_diff > 0):
        target = board.get_piece(er, ec)
        return target is None or target.color != self.color
    return False
\`\`\`

The condition \`row_diff + col_diff > 0\` ensures the king actually moves (not staying in place).

### Knight
The only piece that **jumps** over other pieces. Moves in an L-shape: 2 squares in one direction and 1 in the perpendicular.

\`\`\`python
def can_move(self, board, sr, sc, er, ec):
    row_diff = abs(er - sr)
    col_diff = abs(ec - sc)
    if not ((row_diff == 2 and col_diff == 1) or (row_diff == 1 and col_diff == 2)):
        return False
    target = board.get_piece(er, ec)
    return target is None or target.color != self.color
\`\`\`

No path checking is needed because knights jump.

### Pawn
The most complex piece despite seeming simple:
- Moves forward **one square** (cannot capture forward)
- Moves forward **two squares** from starting rank (both squares must be empty)
- Captures **diagonally forward** one square
- Direction depends on color (White moves up, Black moves down)

\`\`\`python
direction = -1 if self.color == Color.WHITE else 1  # White goes up (row decreases)
\`\`\`

### Sliding Pieces (Rook, Bishop, Queen)

These pieces can move multiple squares but cannot jump over other pieces. The \`is_path_clear\` method checks every square between start and end:

\`\`\`python
def is_path_clear(self, start_row, start_col, end_row, end_col):
    row_step = 0 if end_row == start_row else (1 if end_row > start_row else -1)
    col_step = 0 if end_col == start_col else (1 if end_col > start_col else -1)
    r, c = start_row + row_step, start_col + col_step
    while (r, c) != (end_row, end_col):
        if self.grid[r][c].piece is not None:
            return False
        r += row_step
        c += col_step
    return True
\`\`\`

This works for horizontal, vertical, and diagonal paths. The direction is computed from the sign of the difference.

## King Safety Check

The most critical validation: a move is **illegal** if it leaves (or keeps) your own king in check.

\`\`\`python
# Try the move
captured = self.board.move_piece(start_row, start_col, end_row, end_col)

# Check if move leaves own king in check
if self.board.is_in_check(player.color):
    # Undo the move
    self.board.grid[start_row][start_col].place_piece(piece)
    self.board.grid[end_row][end_col].remove_piece()
    if captured:
        self.board.grid[end_row][end_col].place_piece(captured)
        captured.is_alive = True
    return False  # Move is illegal
\`\`\`

We use a **make-then-unmake** approach: execute the move, check the resulting position, and undo it if invalid. This is simpler than trying to predict whether the move would cause check without actually making it.

## Check and Checkmate Detection

**Check:** The king is under attack. We check every opponent piece to see if any can move to the king's position:

\`\`\`python
def is_in_check(self, color):
    king_row, king_col = self.find_king(color)
    for r in range(self.SIZE):
        for c in range(self.SIZE):
            piece = self.grid[r][c].piece
            if piece and piece.color == opponent:
                if piece.can_move(self, r, c, king_row, king_col):
                    return True
    return False
\`\`\`

**Checkmate:** The king is in check AND no legal move can escape it. We try every possible move for every piece of the checked color. If none leaves the king safe, it is checkmate.

## Special Moves (Extensions)

In a full interview, mention these even if you do not implement them:

1. **Castling:** King moves two squares toward a rook. Requirements: neither has moved, no pieces between them, king not in check, king does not pass through check.

2. **En Passant:** A pawn that has just moved two squares can be captured by an adjacent opponent pawn as if it had moved only one square.

3. **Pawn Promotion:** When a pawn reaches the opposite end, it must be promoted to Queen, Rook, Bishop, or Knight.

Each of these would add special-case logic in the relevant piece's \`can_move()\` method or in the Game's \`make_move()\` method.
`,
    },
    {
      id: "ood-chess-5",
      slug: "chess-walkthrough",
      title: "Chess Game: Walkthrough",
      content: `# Chess Game: Code Walkthrough

Let us trace through a complete game flow and analyze the design decisions that make this implementation elegant and extensible.

## Architecture Overview

\`\`\`
Game
  |
  +-- board: Board
  |     |
  |     +-- grid: Square[8][8]
  |           |
  |           +-- piece: Piece | None
  |                 |
  |                 +-- King, Queen, Rook, Bishop, Knight, Pawn
  |
  +-- players: [Player(WHITE), Player(BLACK)]
  +-- move_history: list[Move]
  +-- status: GameStatus
\`\`\`

## Design Patterns Used

### 1. Template Method (Piece.can_move)
Each piece subclass implements \`can_move()\` differently, but the calling code in \`Game.make_move()\` treats all pieces uniformly through the abstract base class. This is **polymorphism** in action.

### 2. Command (Move)
The Move class encapsulates a complete action: what piece moved, where it started, where it ended, and what was captured. This enables:
- **Move history** -- replay the game
- **Undo** -- reverse a move (with stored captured piece)
- **Notation** -- convert moves to algebraic notation

### 3. Observer (potential extension)
A GUI chess application would use Observer: when the board state changes, notify the UI to re-render. When the game status changes, notify players.

## Walkthrough: Opening Moves

\`\`\`python
game = Game("Alice", "Bob")
game.board.display()
\`\`\`

Output:
\`\`\`
  a b c d e f g h
  +-+-+-+-+-+-+-+-+
8 r n b q k b n r 8
7 p p p p p p p p 7
6 . . . . . . . . 6
5 . . . . . . . . 5
4 . . . . . . . . 4
3 . . . . . . . . 3
2 P P P P P P P P 2
1 R N B Q K B N R 1
  +-+-+-+-+-+-+-+-+
  a b c d e f g h
\`\`\`

**Move 1: White plays e4**
\`\`\`python
game.make_move(6, 4, 4, 4)  # Row 6, Col 4 -> Row 4, Col 4
\`\`\`

Validation chain:
1. Game is ACTIVE -- pass
2. Current player is WHITE (Alice) -- pass
3. Piece at (6,4) is a White Pawn -- pass
4. Pawn.can_move: forward 2 from starting rank, both squares empty -- pass
5. Move does not leave White king in check -- pass

The pawn moves from row 6 to row 4. Move is recorded in history.

**Move 2: Black plays e5**
\`\`\`python
game.make_move(1, 4, 3, 4)  # Row 1, Col 4 -> Row 3, Col 4
\`\`\`

Turn switched to BLACK (Bob). Same validation chain applies.

## Walkthrough: Check Detection

Imagine a position where White's queen moves to threaten Black's king:

1. White moves Queen to a square that attacks the Black king
2. After the move, \`board.is_in_check(Color.BLACK)\` returns True
3. The system checks \`board.has_any_legal_move(Color.BLACK)\`
4. If Black has legal moves: print "Check!" and continue
5. If Black has NO legal moves: "Checkmate! White wins!"

## SOLID Principles Applied

| Principle | Application |
|-----------|-------------|
| **SRP** | Piece knows movement rules. Board manages grid. Game manages rules and turns. Move records history. |
| **OCP** | Adding a new piece type (e.g., fairy chess pieces) requires only a new Piece subclass. No existing code changes. |
| **LSP** | All Piece subclasses can substitute for the base Piece class. Game calls \`piece.can_move()\` polymorphically. |
| **ISP** | Piece only exposes \`can_move()\` and \`get_symbol()\`. Board only exposes grid operations and check detection. |
| **DIP** | Game depends on the Piece abstraction, not on concrete King/Queen/etc. classes. |

## Extensibility Discussion

### Adding Castling
\`\`\`python
class King(Piece):
    def can_move(self, board, sr, sc, er, ec):
        # Standard king move
        if abs(er-sr) <= 1 and abs(ec-sc) <= 1:
            # ... existing logic
            pass
        # Castling: king moves 2 squares horizontally
        if abs(ec-sc) == 2 and er == sr and not self.has_moved:
            # Check rook has not moved, path clear, not in check
            pass
\`\`\`

### Adding Move Timer
\`\`\`python
class Player:
    def __init__(self, name, color, time_limit_seconds=600):
        self.remaining_time = time_limit_seconds
        self.clock_running = False
\`\`\`

### Adding Game Persistence
\`\`\`python
class Game:
    def to_fen(self) -> str:
        # Convert board state to FEN notation
        pass

    @classmethod
    def from_fen(cls, fen: str) -> "Game":
        # Reconstruct game from FEN notation
        pass
\`\`\`

## Common Interview Follow-ups

**Q: How efficient is checkmate detection?**
A: Our brute-force approach tries all possible moves for all pieces (up to 16 pieces x 64 squares = 1024 attempts). For each, it makes and unmakes the move and checks for check. This is O(n^2) where n is the board size. For 8x8, this is fast enough.

**Q: How would you add an AI player?**
A: Create an AIPlayer class that implements a move selection algorithm (minimax with alpha-beta pruning). The Game class would call \`player.select_move(board)\` instead of waiting for user input.

**Q: How would you support multiple games simultaneously?**
A: Each Game instance is already self-contained with its own Board and Players. A GameServer class could manage multiple active Game instances, each identified by a game ID.
`,
    },
  ],
};
