import * as React from "react";
import * as moment from "moment";
import "./App.css";

// import logo from './logo.svg';
import { Show } from "./models/show-dates";

interface AppState {
  lastViewedDateTime?: Date;
  lastUpdatedDateTime: Date;

  shows: Show[];

  error?: any;

  showPastEvents: boolean;

  artistsSearchTerm?: string;
}

class App extends React.Component<{}, AppState> {
  constructor(
    props: {},
    state: AppState = {
      lastViewedDateTime: new Date(),
      lastUpdatedDateTime: new Date(),
      shows: [],
      showPastEvents: false
    }
  ) {
    super(props, state);

    const lastViewedDateTimeText = localStorage.getItem("lastViewedDateTime");
    let lastViewedDateTimeOrCurrent = new Date("January 01, 2018");

    if (lastViewedDateTimeText) {
      try {
        lastViewedDateTimeOrCurrent = new Date(
          parseInt(lastViewedDateTimeText, 10)
        );
      } catch (error) {
        lastViewedDateTimeOrCurrent = new Date();
      }
    }

    const currentDateTime = new Date();
    const currentDateTimeTicks = currentDateTime.getTime();
    // new Date().getTime() * 10000 + 621355968000000000;

    localStorage.setItem(
      "lastViewedDateTime",
      currentDateTimeTicks.toString(10)
    );

    this.state = {
      ...state,
      lastViewedDateTime: lastViewedDateTimeOrCurrent
    };
  }

  componentDidMount() {
    // const urlBase = "https://snerks.github.io/recommended-shows-ts01/";
    const urlBase = "";

    const fileName = "recommended-shows.json";
    const url = `${urlBase}${fileName}`;

    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(
        result => {
          const nextState: AppState = {
            lastUpdatedDateTime: new Date(result.lastUpdated),
            shows: result.shows as Show[],
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
    const {
      lastViewedDateTime,
      lastUpdatedDateTime,
      shows,
      error,
      artistsSearchTerm
    } = this.state;

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

    const tableRows = visibleShowDates.map((show: Show, showIndex: number) => {
      const venueCell = show.detailsUri ? (
        <a href={show.detailsUri}>{show.venue}</a>
      ) : (
        show.venue
      );

      const priceBadge = show.priceText &&
        show.priceText.indexOf("£") === 0 && (
          <span className="badge badge-info" style={{ marginRight: 10 }}>
            {show.priceText}
          </span>
        );

      const priceLink = show.detailsUri ? (
        <a href={show.detailsUri}>{priceBadge}</a>
      ) : (
        priceBadge
      );

      const onSaleDateBadge = show.onSaleDate && (
        <span className="badge badge-primary" style={{ marginRight: 10 }}>
          {"On sale: "}
          {moment(show.onSaleDate).format("ddd DD-MMM-YYYY")}
        </span>
      );

      return (
        <tr key={showIndex}>
          <td>{moment(show.date).format("ddd")}</td>
          <td>{moment(show.date).format("DD-MMM-YYYY")}</td>
          <td>
            <div>
              {show.artists.map((artist, artistIndex) => {
                const videoBadge = artist.videoUrl && (
                  <span
                    className="badge badge-danger"
                    style={{ marginRight: 10 }}
                  >
                    {"Video"}
                  </span>
                );

                const videoLink = artist.videoUrl ? (
                  <a href={artist.videoUrl}>{videoBadge}</a>
                ) : null;

                const stageTimeBadge = artist.stageTime && (
                  <span
                    className="badge badge-pill badge-primary"
                    style={{ marginRight: 10 }}
                    title="Stage Time"
                  >
                    {artist.stageTime}
                  </span>
                );

                return (
                  <p key={artistIndex}>
                    {artist.name} {stageTimeBadge} {videoLink}
                  </p>
                );
              })}
            </div>
          </td>
          <td>{venueCell}</td>
          <td>
            {isRecentlyAdded(show) && (
              <span className="badge badge-info" style={{ marginRight: 10 }}>
                New!
              </span>
            )}
            {show.isSoldOut && (
              <span className="badge badge-warning" style={{ marginRight: 10 }}>
                Sold Out
              </span>
            )}
            {show.isCancelled && (
              <span className="badge badge-danger" style={{ marginRight: 10 }}>
                Cancelled
              </span>
            )}
            {priceLink}
            {onSaleDateBadge}
            {show.notes && (
              <span style={{ marginRight: 10 }}>{show.notes}</span>
            )}
          </td>
        </tr>
      );
    });

    const haveNewUpdates = lastViewedDateTime
      ? lastUpdatedDateTime > lastViewedDateTime
      : true;

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
              {visibleShowDates.length !== 1 ? "s" : ""}{" "}
            </div>
            <div className="col-1">
              {haveNewUpdates && <span className="badge badge-info">New!</span>}
            </div>
            <div className="col-3">
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
              {/* <div>
                Last Updated:{" "}
                {moment(lastUpdatedDateTime).format("DD-MMM-YYYY HH:mm")}
              </div>
              <div>
                Last Viewed:{" "}
                {moment(lastViewedDateTime).format("DD-MMM-YYYY HH:mm")}
              </div>
              <div>New Items: {haveNewUpdates ? "Yes!" : "No"}</div> */}
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
