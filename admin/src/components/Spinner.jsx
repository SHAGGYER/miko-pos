import React from 'react';
import styled, {keyframes} from "styled-components";
import IconSpinner from "../images/icon_spinner.svg"

const Spin = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`

const Wrapper = styled.div`
  animation-name: ${Spin};
  animation-duration: 5000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`

function Spinner({width}) {
    return (
        <Wrapper>
            <img src={IconSpinner} style={{width}} alt="spinner"/>
        </Wrapper>
    );
}

export default Spinner;