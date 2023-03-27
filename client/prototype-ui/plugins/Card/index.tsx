import React from "react";
import ReactDom from "react-dom";
//@ts-ignore
import reactToWebComponent from "react-to-webcomponent";
import { Card, PlayerState, Color } from "../../../../api/types";
import { HathoraConnection } from "../../../.hathora/client";

function CardComponent({
  val,
  state,
  client,
}: {
  val: Card;
  state: PlayerState;
  client: HathoraConnection;
}) {
  const styles = {
    width: "50px",
    height: "75px",
    lineHeight: "75px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: `${Color[val.color].toLowerCase()}`,
  };
  return (
    <div style={styles} onClick={() => client.playCard({ card: val })}>
      {val.value}
    </div>
  );
}

export default reactToWebComponent(CardComponent, React, ReactDom);
