import React, { Component } from "react";

class Block extends Component {
  state = { displayTransaction: false };

  toggleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction });
  }

  get displayTransaction() {
    const { data } = this.props.block;

    const stringifiedData = JSON.stringify(data);

    const dataDisplay = stringifiedData.length > 35 ?
      `${stringifiedData.substring(0, 35)}...`:
      stringifiedData;

      return <div>Data: {dataDisplay}</div>
  }

  render() {
    const { timestamp, hash, data } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;
    const stringifiedData = JSON.stringify(data);

    const dataDisplay =
      stringifiedData.length > 15
        ? `${stringifiedData.substring(0, 15)}...`
        : stringifiedData;

    return (
      <div className="Block">
        <div>Hash: {hashDisplay} </div>
        <div>timestamp: {new Date(timestamp).toLocaleString()}</div>
        <div>Data: {dataDisplay}</div>
      </div>
    );
  }
}
