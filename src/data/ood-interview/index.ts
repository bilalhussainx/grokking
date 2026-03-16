import { Course } from "../types";
import { fundamentalsModule } from "./01-fundamentals";
import { libraryManagementModule } from "./02-library-management";
import { parkingLotModule } from "./03-parking-lot";
import { onlineShoppingModule } from "./04-online-shopping";
import { movieTicketBookingModule } from "./05-movie-ticket-booking";
import { chessGameModule } from "./06-chess-game";
import { atmSystemModule } from "./07-atm-system";
import { hotelManagementModule } from "./08-hotel-management";

export const oodInterviewCourse: Course = {
  id: "ood-interview",
  slug: "ood-interview",
  title: "Object-Oriented Design Masterclass",
  description:
    "Master object-oriented design for interviews. Design real-world systems like parking lots, shopping carts, chess games, and more using SOLID principles and design patterns.",
  icon: "🏛️",
  tier: "pro",
  modules: [
    fundamentalsModule,
    libraryManagementModule,
    parkingLotModule,
    onlineShoppingModule,
    movieTicketBookingModule,
    chessGameModule,
    atmSystemModule,
    hotelManagementModule,
  ],
};
