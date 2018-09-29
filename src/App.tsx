import * as React from "react";
import * as moment from "moment";
import "./App.css";

// import logo from './logo.svg';
import { Show } from "./models/show-dates";

interface AppState {
  shows: Show[];

  error?: any;

  showPastEvents: boolean;

  artistsSearchTerm?: string;
}

class App extends React.Component<{}, AppState> {
  constructor(
    props: {},
    state: AppState = { shows: [], showPastEvents: false }
  ) {
    super(props, state);

    this.state = state;
  }

  componentDidMount() {
    fetch("recommended-shows.json")
      .then(res => {
        return res.json();
      })
      .then(
        result => {
          const nextState: AppState = {
            shows: result as Show[],
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

    const inputValue = event.target.value ? event.target.value.trim() : "";

    this.setState(prevState => {
      const nextState = { ...prevState };

      nextState.artistsSearchTerm = inputValue;

      return nextState;
    });
  };

  visibleShowFilter = (show: Show) => {
    if (!this.state) {
      return true;
    }

    const { showPastEvents } = this.state;

    const currentDateTime = new Date();

    let willShowEvent = false;

    if (showPastEvents) {
      willShowEvent = true;
    } else {
      const eventDate = new Date(show.date);
      const eventDateEndOfDay = moment(eventDate).endOf("day");

      const isPastEvent = eventDateEndOfDay.isBefore(currentDateTime);

      willShowEvent = !isPastEvent;
    }

    return willShowEvent;
  };

  public render() {
    const { shows, error, artistsSearchTerm } = this.state;

    if (error) {
      return <div>Error: {JSON.stringify(error)}</div>;
    }

    if (!shows || shows.length === 0) {
      return <div>Loading Shows...</div>;
    }

    // console.log(`Shows.length = [${shows.length}]`);

    const inDateRangeShowDates = shows.filter(this.visibleShowFilter);

    // console.log(
    //   `inDateRangeShowDates.length = [${inDateRangeShowDates.length}]`
    // );

    const artistFilterShowDates = inDateRangeShowDates.filter(show => {
      if (!artistsSearchTerm) {
        return true;
      }

      const showText = show.artists.reduce(
        (previousArtistsResult, currentArtist, currentArtistIndex) => {
          const currentArtistText = currentArtist.name;

          return currentArtistIndex === 0
            ? currentArtistText
            : previousArtistsResult + " " + currentArtistText;
        },
        ""
      );

      return (
        showText.toLowerCase().indexOf(artistsSearchTerm.toLowerCase()) > -1
      );
    });

    const visibleShowDates1 = artistFilterShowDates;

    const visibleShowDates = visibleShowDates1.sort((lhs: Show, rhs: Show) => {
      const lhsDate = new Date(lhs.date);
      const rhsDate = new Date(rhs.date);

      const result = lhsDate.getTime() - rhsDate.getTime();

      return result;
    });

    const isRecentlyAdded = (show: Show) => {
      if (!show.addedDate) {
        return false;
      }

      const addedDate = new Date(show.addedDate);
      const currentDate = new Date();

      const millisecondsSinceAdded =
        currentDate.getTime() - addedDate.getTime();

      const thresholdInDays = 3;
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const thresholdInMilliseconds = thresholdInDays * millisecondsPerDay;

      const result = millisecondsSinceAdded < thresholdInMilliseconds;

      return result;
    };

    const tableRows = visibleShowDates.map((show: Show, showIndex: number) => (
      <tr key={showIndex}>
        <td>{moment(show.date).format("ddd")}</td>
        <td>{moment(show.date).format("DD-MMM-YYYY")}</td>
        <td>
          <div>
            {show.artists.map((artist, artistIndex) => (
              <p key={artistIndex}>{artist.name}</p>
            ))}
          </div>
        </td>
        <td>{show.venue}</td>
        <td>
          {isRecentlyAdded(show) && (
            <span className="badge badge-info" style={{ marginRight: 10 }}>
              New
            </span>
          )}
          {show.isSoldOut && (
            <span className="badge badge-danger" style={{ marginRight: 10 }}>
              Sold Out
            </span>
          )}
          {show.isCancelled && (
            <span className="badge badge-warning" style={{ marginRight: 10 }}>
              Cancelled
            </span>
          )}
          {show.notes && <span style={{ marginRight: 10 }}>{show.notes}</span>}
        </td>
      </tr>
    ));

    return (
      <div className="table-responsive">
        <form style={{ margin: "10px 15px 10px 15px" }}>
          <div className="form-row">
            <div className="col-6">
              <label
                className="sr-only"
                htmlFor="inlineFormInputGroupUsername2"
              >
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
            </div>
            <div className="col-2">
              <span className="badge badge-dark">
                {visibleShowDates.length}
              </span>{" "}
              item
              {visibleShowDates.length !== 1 ? "s" : ""}
            </div>
            <div className="col-4">
              <div className="form-check mb-2 mr-sm-2">
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
                    Past Events
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>

        <table className="table table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Artists</th>
              <th>Venue</th>
              <th>&#160;</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    );
  }
}

export default App;
