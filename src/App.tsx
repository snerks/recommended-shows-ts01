import * as React from "react";
import * as moment from "moment";
import "./App.css";

// import logo from './logo.svg';
import { ShowDate } from "./show-dates";

interface AppState {
  showDates: ShowDate[];

  error?: any;

  showPastEvents: boolean;
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
    this.setState((prevState, props) => {
      const nextState = { ...prevState };
      nextState.showPastEvents = !prevState.showPastEvents;

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

    const { showDates, error } = this.state;

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

    const visibleShowDates = showDates.filter(this.visibleShowDateFilter);

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
          {/* <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              onChange={() => this.handleShowPastEventsChange()}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Show Past Events
            </label>
          </div> */}

          <div className="form-group row">
            {/* <div className="col-sm-2">Checkbox</div> */}
            {/* <div className="col-sm-10">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck1"
                  onChange={() => this.handleShowPastEventsChange()}
                />
                <label className="form-check-label" htmlFor="gridCheck1">
                  Show Past Events
                </label>
              </div>
            </div> */}

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
