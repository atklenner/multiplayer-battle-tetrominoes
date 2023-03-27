import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  Color,
  Card,
  Player,
  PlayerState,
  UserId,
  IInitializeRequest,
  IJoinGameRequest,
  IStartGameRequest,
  IPlayCardRequest,
  IDrawCardRequest,
} from "../api/types";

type InternalState = {
  deck: Card[];
  hands: { userId: UserId; cards: Card[] }[];
  turnIdx: number;
  pile?: Card;
};

export class Impl implements Methods<InternalState> {
  initialize(ctx: Context, request: IInitializeRequest): InternalState {
    const deck = [];
    for (let i = 2; i <= 9; i++) {
      deck.push({ value: i, color: Color.RED });
      deck.push({ value: i, color: Color.BLUE });
      deck.push({ value: i, color: Color.GREEN });
      deck.push({ value: i, color: Color.YELLOW });
    }
    return { deck, hands: [], turnIdx: 0 };
  }
  joinGame(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IJoinGameRequest
  ): Response {
    state.hands.push({ userId, cards: [] });
    return Response.ok();
  }
  startGame(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IStartGameRequest
  ): Response {
    state.hands = ctx.chance.shuffle(state.hands);
    state.deck = ctx.chance.shuffle(state.deck);
    state.hands.forEach((hand) => {
      for (let i = 0; i < 7; i++) {
        hand.cards.push(state.deck.pop()!);
      }
    });
    state.pile = state.deck.pop();
    return Response.ok();
  }
  playCard(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IPlayCardRequest
  ): Response {
    const { cards } = state.hands[state.turnIdx];
    const cardIdx = cards.findIndex(
      (card) =>
        card.value == request.card.value && card.color == request.card.color
    );
    if (cardIdx < 0) {
      return Response.error("Card not in hand");
    }
    cards.splice(cardIdx, 1);
    state.pile = request.card;
    state.turnIdx = (state.turnIdx + 1) % state.hands.length;
    return Response.ok();
  }
  drawCard(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IDrawCardRequest
  ): Response {
    const hand = state.hands[state.turnIdx];
    if (hand.userId !== userId) {
      return Response.error("Not your turn!");
    }
    hand.cards.push(state.deck.pop()!);
    return Response.ok();
  }
  getUserState(state: InternalState, userId: UserId): PlayerState {
    return {
      hand: state.hands.find((hand) => hand.userId === userId)?.cards ?? [],
      players: state.hands.map((hand) => ({
        id: hand.userId,
        numCards: hand.cards.length,
      })),
      turn:
        state.pile !== undefined
          ? state.hands[state.turnIdx].userId
          : undefined,
      pile: state.pile,
      winner: state.hands.find((hand) => hand.cards.length === 0)?.userId,
    };
  }
}
