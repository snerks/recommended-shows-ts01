// export interface ShowDate {
//   date: Date;

//   shows: Show[];
// }

export interface Show {
  addedDate?: Date;
  isSoldOut: boolean;
  isCancelled: boolean;

  date: Date;
  venue: string;

  artists: Artist[];

  notes?: string;
}

export interface Artist {
  name: string;
}
