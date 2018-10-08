// export interface ShowDate {
//   date: Date;

//   shows: Show[];
// }

export interface ShowsInfo {
  lastUpdated: Date;
  shows: Show[];
}

export interface Show {
  addedDate?: Date;
  isSoldOut: boolean;
  isCancelled: boolean;

  onSaleDate?: Date;

  priceText?: string;

  date: Date;
  venue: string;

  artists: Artist[];

  notes?: string;

  detailsUri?: string;
}

export interface Artist {
  name: string;
  stageTime?: string;

  videoUrl?: string;
}
