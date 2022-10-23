import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { HttpClient } from "../utilities/HttpClient";
import { Page } from "../components/Page";

function Dashboard(props) {
  const [loading, setLoading] = useState(false);
  return <Page>{loading ? <h3>Loading...</h3> : <>Dashboard</>}</Page>;
}

export default Dashboard;
