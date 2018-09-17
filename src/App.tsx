import * as React from "react";
import * as moment from "moment";
import "./App.css";

// import logo from './logo.svg';
import { ShowDate } from "./show-dates";

interface AppState {
  showDates: ShowDate[];

  error?: any;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}, state: AppState = { showDates: [] }) {
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
            error: undefined
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

    const tableRows = showDates.map(showDate =>
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
