// ShowDate[] showDates;

// protected override async Task OnInitAsync()
// {
//     showDates = await Http.GetJsonAsync<ShowDate[]>("sample-data/recommended-shows.json");
// }

export interface ShowDate {
  date: string;

  shows: Show[];
}

export interface Show {
  venue: string;

  artists: Artist[];
}

export interface Artist {
  name: string;
}
