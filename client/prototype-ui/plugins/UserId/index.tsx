import React from "react";
import ReactDom from "react-dom";
//@ts-ignore
import reactToWebComponent from "react-to-webcomponent";
import { UserId, PlayerState } from "../../../../api/types";
import { HathoraConnection } from "../../../.hathora/client";

function UserIdComponent({
  val,
  state,
  client,
}: {
  val: UserId;
  state: PlayerState;
  client: HathoraConnection;
}) {
  const styles = {
    padding: "2rem",
  };
  return <div style={styles}>{val}</div>;
}

export default reactToWebComponent(UserIdComponent, React, ReactDom);
