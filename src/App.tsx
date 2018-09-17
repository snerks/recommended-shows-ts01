import * as React from "react";
import "./App.css";

// import logo from './logo.svg';
import { ShowDate } from "./show-dates";

class App extends React.Component {
  showDates: ShowDate[] = [
    {
      date: "2018-09-17",
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
      date: "2018-09-21",
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

    const tableRows = this.showDates.map(showDate =>
      showDate.shows.map((show, showIndex) => (
        <tr key={showIndex}>
          <td>{showDate.date.toString()}</td>
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
        <thead>
          <tr>
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
