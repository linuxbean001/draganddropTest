import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag, generateItems } from "./util.js";

const lorem = ``;

const columnNames = ["First Row", "Second Row"];

const cardColors = [ 
  "#9CCB3B",
  "#F4B646",
  "#4DB9AB",
  "#F06D78"
];

const cardWidth =[
20,50,100,40,60,200,150,25,50,100
];

const pickColor = () => {
  let rand = Math.floor(Math.random() * 4);
  return cardColors[rand];
};

const pickWidth = () => {
    for(let i=0; i<cardWidth.length; i++){
        return cardWidth[i];
     }
  };

class Cards extends Component {
  constructor() {
    super();

    this.onColumnDrop = this.onColumnDrop.bind(this);
    this.onCardDrop = this.onCardDrop.bind(this);
    this.getCardPayload = this.getCardPayload.bind(this);
    this.state = {
      scene: {
        type: "container",
        props: {
          orientation: "vertical"
        },
        children: generateItems(2, i => ({
          id: `column${i}`,
          type: "container",
          name: columnNames[i],
          props: {
            orientation: "horizontal",
            className: "card-container"
          },
          children: generateItems(5, j => ({
            type: "draggable",
            id: `${i}${j}`,
            props: {
              className: "card",
              style: { backgroundColor: pickColor(),width:Math.floor(Math.random() * 90 + 20)+'px',height:'100px' }
            },
            data: lorem
          }))
        }))
      }
    };
  }

  render() {
    return (
      <div className="card-scene">
        <Container
          orientation="vertical"
          onDrop={this.onColumnDrop}
          dragHandleSelector=".column-drag-handle"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'cards-drop-preview'
          }}
        >
          {this.state.scene.children.map(column => {
            return (
              <Draggable key={column.id}>
                <div className={column.props.className}>
                  <div className="card-column-header">
                    <span className="column-drag-handle">&#x2630;</span>
                    {column.name}
                  </div>
                  <Container
                    {...column.props}
                    groupName="col"
                    onDragStart={e => console.log("drag started", e)}
                    onDragEnd={e => console.log("drag end", e)}
                    onDrop={e => this.onCardDrop(column.id, e)}
                    getChildPayload={index =>
                      this.getCardPayload(column.id, index)
                    }
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    onDragEnter={() => {
                      console.log("drag enter:", column.id);
                    }}
                    onDragLeave={() => {
                      console.log("drag leave:", column.id);
                    }}
                    onDropReady={p => console.log('Drop ready: ', p)}
                    dropPlaceholder={{                      
                      animationDuration: 150,
                      showOnTop: true,
                      className: 'drop-preview' 
                    }}
                    dropPlaceholderAnimationDuration={200}
                  >
                    {column.children.map(card => {
                      return (
                        <Draggable key={card.id}>
                          <div {...card.props}>
                            <p>{card.data}</p>
                          </div>
                        </Draggable>
                      );
                    })}
                  </Container>
                </div>
              </Draggable>
            );
          })}
        </Container>
      </div>
    );
  }

  getCardPayload(columnId, index) {
    return this.state.scene.children.filter(p => p.id === columnId)[0].children[
      index
    ];
  }

  onColumnDrop(dropResult) {
    const scene = Object.assign({}, this.state.scene);
    scene.children = applyDrag(scene.children, dropResult);
    this.setState({
      scene
    });
  }

  onCardDrop(columnId, dropResult) {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      const scene = Object.assign({}, this.state.scene);
      const column = scene.children.filter(p => p.id === columnId)[0];
      const columnIndex = scene.children.indexOf(column);

      const newColumn = Object.assign({}, column);
      newColumn.children = applyDrag(newColumn.children, dropResult);
      scene.children.splice(columnIndex, 1, newColumn);

      this.setState({
        scene
      });
    }
  }
}

export default Cards;