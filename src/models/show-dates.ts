export interface ShowDate {
  date: Date;

  shows: Show[];
}

export interface Show {
  venue: string;

  artists: Artist[];
}

export interface Artist {
  name: string;
}
