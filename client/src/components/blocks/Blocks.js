import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Block from "./Block";

class Blocks extends Component {
  state = { blocks: [], paginatedId: 1, blocksLength: 0 };

  componentDidMount() {
    fetch(`/api/blocks/length`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
  })
      .then(json => this.setState({ blocksLength: json }))
      .catch(err => console.error('Fetch error:', err));
    this.fetchPaginatedBlocks(this.state.paginatedId)();
  }

  fetchPaginatedBlocks = paginatedId => () => {
    fetch(`/api/blocks/${paginatedId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(json => this.setState({ blocks: json }))
      .catch(err => console.error('Fetch error:', err));

  };

  render() {
    return (
      <div className="Blocks">
        <h3 className="pageTitle">Blocks</h3>
        <div>
          {[...Array(Math.ceil(this.state.blocksLength / 5)).keys()].map(
            key => {
              const paginatedId = key + 1;

              return (
                <span
                  key={key}
                  onClick={() => this.fetchPaginatedBlocks(paginatedId)}
                >
                  <Button variant="warning" size="sm">
                    {paginatedId}
                  </Button>{" "}
                </span>
              );
            }
          )}
        </div>
        {this.state.blocks.map(block => {
          return (
            <div key={block.hash}>
              <Block key={block.hash} block={block} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Blocks;