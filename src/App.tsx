import * as React from "react";
import * as moment from "moment";
import "./App.css";

// import logo from './logo.svg';
import { ShowDate } from "./show-dates";

class App extends React.Component {
  showDates: ShowDate[] = [
    {
      date: new Date("2018-09-17T20:00:00.000Z"),
      shows: [
        {
          artists: [
            {
              name: "Chuck Prophet and Stephanie Finch"
            }
          ],
          venue: "Hen and Chicken"
        }
      ]
    },
    {
      date: new Date("2018-09-21T20:00:00.000Z"),
      shows: [
        {
          artists: [
            {
              name: "Nightingales"
            },
            {
              name: "Stewart Lee"
            }
          ],
          venue: "Exchange"
        }
      ]
    }
  ];

  componentDidMount() {
    console.log("TODO: fetch data");
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

    if (this.showDates.length === 0) {
      return <div>Loading Shows...</div>;
    }

    // moment().format('MMMM Do YYYY, h:mm:ss a')

    const tableRows = this.showDates.map(showDate =>
      showDate.shows.map((show, showIndex) => (
        <tr key={showIndex}>
          <td>{moment(showDate.date).format("dddd")}</td>
          <td>{moment(showDate.date).format("DD-MMM-YYYY")}</td>
          <td>
            <ul>
              {show.artists.map((artist, artistIndex) => (
                <li key={artistIndex}>{artist.name}</li>
              ))}
            </ul>
          </td>
          <td>{show.venue}</td>
        </tr>
      ))
    );

    return (
      <table className="table">
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
    );
  }
}

export default App;
