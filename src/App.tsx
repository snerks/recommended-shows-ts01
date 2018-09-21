import * as React from "react";
import * as moment from "moment";
import "./App.css";

// import logo from './logo.svg';
import { ShowDate } from "./models/show-dates";

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

  componentDidMount() {
    fetch("recommended-shows.json")
      .then(res => {
        return res.json();
      })
      .then(
        result => {
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

    const inputValue = event.target.value ? event.target.value.trim() : "";

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
      const eventDate = new Date(showDate.date);
      const eventDateEndOfDay = moment(eventDate).endOf("day");

      const isPastEvent = eventDateEndOfDay.isBefore(currentDateTime);

      willShowEvent = !isPastEvent;
    }

    return willShowEvent;
  };

  public render() {
    const { showDates, error, artistsSearchTerm } = this.state;

    if (error) {
      return <div>Error: {JSON.stringify(error)}</div>;
    }

    if (!showDates || showDates.length === 0) {
      return <div>Loading Shows...</div>;
    }

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

      return (
        showsText.toLowerCase().indexOf(artistsSearchTerm.toLowerCase()) > -1
      );
    });

    const visibleShowDates1 = artistFilterShowDates;

    const visibleShowDates = visibleShowDates1.sort(
      (lhs: ShowDate, rhs: ShowDate) => {
        const lhsDate = new Date(lhs.date);
        const rhsDate = new Date(rhs.date);

        const result = lhsDate.getTime() - rhsDate.getTime();
        return result;
      }
    );

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
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    );
  }
}

export default App;
