// export interface ShowDate {
//   date: Date;

//   shows: Show[];
// }

export interface Show {
  addedDate?: Date;
  isSoldOut: boolean;

  date: Date;
  venue: string;

  artists: Artist[];
}

export interface Artist {
  name: string;
}
