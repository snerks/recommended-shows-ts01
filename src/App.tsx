import * as React from "react";
import * as moment from "moment";
import "./App.css";

// import logo from './logo.svg';
import { ShowDate } from "./show-dates";

interface AppState {
  showDates: ShowDate[];

  error?: any;

  showPastEvents: boolean;

  artistsSearchTerm?: string;
}

class App extends React.Component<{}, AppState> {
  constructor(
    props: {},
    state: AppState = { showDates: [], showPastEvents: false }
  ) {
    super(props, state);

    this.state = state;
  }

  // showDates: ShowDate[] = [
  //   {
  //     date: new Date("2018-09-17T20:00:00.000Z"),
  //     shows: [
  //       {
  //         artists: [
  //           {
  //             name: "Chuck Prophet and Stephanie Finch"
  //           }
  //         ],
  //         venue: "Hen and Chicken"
  //       }
  //     ]
  //   },
  //   {
  //     date: new Date("2018-09-21T20:00:00.000Z"),
  //     shows: [
  //       {
  //         artists: [
  //           {
  //             name: "Nightingales"
  //           },
  //           {
  //             name: "Stewart Lee"
  //           }
  //         ],
  //         venue: "Exchange"
  //       }
  //     ]
  //   }
  // ];

  componentDidMount() {
    // console.log("Fetch data : start");
    fetch("recommended-shows.json")
      .then(res => {
        // console.log("Success", res);
        return res.json();
      })
      .then(
        result => {
          // console.log("SetState with: ", result);
          const nextState: AppState = {
            showDates: result as ShowDate[],
            error: undefined,
            showPastEvents: false
          };

          this.setState(nextState);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            error
          });
        }
      );
  }

  handleShowPastEventsChange = () => {
    this.setState(prevState => {
      const nextState = { ...prevState };
      nextState.showPastEvents = !prevState.showPastEvents;

      return nextState;
    });
  };

  handleArtistsSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event) {
      return;
    }

    if (!event.target) {
      return;
    }

    const inputValue = event.target.value; // Cache the value of e.target.value

    this.setState(prevState => {
      const nextState = { ...prevState };

      nextState.artistsSearchTerm = inputValue;

      return nextState;
    });
  };

  visibleShowDateFilter = (showDate: ShowDate) => {
    if (!this.state) {
      return true;
    }

    const { showPastEvents } = this.state;

    const currentDateTime = new Date();

    let willShowEvent = false;

    if (showPastEvents) {
      willShowEvent = true;
    } else {
      const eventDateTime = new Date(showDate.date);
      const isPastEvent = eventDateTime <= currentDateTime;

      // console.log("isPastEvent = " + isPastEvent);

      willShowEvent = !isPastEvent;
    }

    // console.log("willShowEvent = " + willShowEvent);

    return willShowEvent;
  };

  public render() {
    // return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <h1 className="App-title">Welcome to React</h1>
    //   </header>
    //   <p className="App-intro">
    //     To get started, edit <code>src/App.tsx</code> and save to reload.
    //   </p>
    // </div>
    // );

    const { showDates, error, artistsSearchTerm } = this.state;

    if (error) {
      return <div>Error: {JSON.stringify(error)}</div>;
    }

    if (!showDates || showDates.length === 0) {
      return <div>Loading Shows...</div>;
    }

    // const currentDateTime = new Date();

    // console.log("showPastEvents = " + showPastEvents);
    // console.log("showDates.length = " + showDates.length);

    // const visibleShowDates = showDates.filter(showDate => {
    //   let willShowEvent = false;
    //   if (showPastEvents) {
    //     willShowEvent = true;
    //   } else {
    //     const eventDateTime = new Date(showDate.date);
    //     const isPastEvent = eventDateTime <= currentDateTime;

    //     // console.log("isPastEvent = " + isPastEvent);

    //     willShowEvent = !isPastEvent;
    //   }

    //   console.log("willShowEvent = " + willShowEvent);

    //   return willShowEvent;
    // });

    const inDateRangeShowDates = showDates.filter(this.visibleShowDateFilter);

    const artistFilterShowDates = inDateRangeShowDates.filter(showDate => {
      if (!artistsSearchTerm) {
        return true;
      }

      const showsText = showDate.shows.reduce(
        (previousShowsResult, currentShow, currentShowIndex) => {
          const currentShowArtistsText = currentShow.artists.reduce(
            (previousArtistsResult, currentArtist, currentArtistIndex) => {
              const currentArtistText = currentArtist.name;

              return currentArtistIndex === 0
                ? currentArtistText
                : previousArtistsResult + " " + currentArtistText;
            },
            ""
          );

          return currentShowIndex === 0
            ? currentShowArtistsText
            : previousShowsResult + " " + currentShowArtistsText;
        },
        ""
      );

      // console.log("showsText = " + showsText);
      // console.log(
      //   "showsText.indexOf(artistsSearchTerm) = " +
      //     showsText.indexOf(artistsSearchTerm)
      // );

      return (
        showsText.toLowerCase().indexOf(artistsSearchTerm.toLowerCase()) > -1
      );
    });

    const visibleShowDates = artistFilterShowDates;

    // const visibleShowDates = artistFilterShowDates.filter(showDate => {
    //   if (!artistsSearchTerm) {
    //     return true;
    //   }

    //   const showsText = showDate.shows.reduce(
    //     (previousShowsResult, currentShow, currentShowIndex) => {
    //       const currentShowArtistsText = currentShow.artists.reduce(
    //         (previousArtistsResult, currentArtist, currentArtistIndex) => {
    //           const currentArtistText = currentArtist.name;

    //           return currentArtistIndex === 0
    //             ? currentArtistText
    //             : previousArtistsResult + " " + currentArtistText;
    //         },
    //         ""
    //       );

    //       return currentShowIndex === 0
    //         ? currentShowArtistsText
    //         : previousShowsResult + " " + currentShowArtistsText;
    //     },
    //     ""
    //   );

    //   console.log("showsText = " + showsText);
    //   console.log(
    //     "showsText.indexOf(artistsSearchTerm) = " +
    //       showsText.indexOf(artistsSearchTerm)
    //   );

    //   return (
    //     showsText.toLowerCase().indexOf(artistsSearchTerm.toLowerCase()) > -1
    //   );
    // });

    // console.log("visibleShowDates.length = " + visibleShowDates.length);

    const tableRows = visibleShowDates.map(showDate =>
      showDate.shows.map((show, showIndex) => (
        <tr key={showIndex}>
          <td>{moment(showDate.date).format("ddd")}</td>
          <td>{moment(showDate.date).format("DD-MMM-YYYY")}</td>
          <td>
            <div>
              {show.artists.map((artist, artistIndex) => (
                <p key={artistIndex}>{artist.name}</p>
              ))}
            </div>
          </td>
          <td>{show.venue}</td>
        </tr>
      ))
    );

    return (
      <div className="table-responsive">
        <form style={{ margin: 30 }}>
          <div className="form-row">
            <div className="col-8">
              <label
                className="sr-only"
                htmlFor="inlineFormInputGroupUsername2"
              >
                Filter Artists
              </label>
              <div className="input-group mb-10 mr-sm-2">
                {/* <div className="input-group-prepend">
              <div className="input-group-text">&#8981;</div>
            </div> */}
                <input
                  type="text"
                  className="form-control"
                  id="inlineFormInputGroupUsername2"
                  placeholder="Filter Artists"
                  onChange={this.handleArtistsSearchTermChange}
                />
              </div>
            </div>
            <div className="col-4">
              <div className="form-check mb-2 mr-sm-2">
                {/* <input
              className="form-check-input"
              type="checkbox"
              id="inlineFormCheck"
            />
            <label className="form-check-label" htmlFor="inlineFormCheck">
              Remember me
            </label> */}
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customCheck1"
                    onChange={() => this.handleShowPastEventsChange()}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customCheck1"
                  >
                    Show Past Events
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* <form className="form-inline" style={{ margin: 30 }}>
          <label className="sr-only" htmlFor="inlineFormInputGroupUsername2">
            Filter Artists
          </label>
          <div className="input-group mb-10 mr-sm-2">
            <input
              type="text"
              className="form-control"
              id="inlineFormInputGroupUsername2"
              placeholder="Filter Artists"
              onChange={this.handleArtistsSearchTermChange}
            />
          </div>

          <div className="form-check mb-2 mr-sm-2">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
                onChange={() => this.handleShowPastEventsChange()}
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Show Past Events
              </label>
            </div>
          </div>
        </form> */}

        {/* <form style={{ margin: 30 }}>
          <div className="form-group row">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
                onChange={() => this.handleShowPastEventsChange()}
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Show Past Events
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Filter Artists"
                onChange={this.handleArtistsSearchTermChange}
              />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="Venue" />
            </div>
          </div>
        </form> */}

        <table className="table table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Artists</th>
              <th>Venue</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    );
  }
}

export default App;
