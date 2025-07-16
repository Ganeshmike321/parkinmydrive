import React from "react";
import styled from "styled-components";

// Type definition for props
interface MarkerProps {
  text: string;
  onClick?: () => void;
}

// Styled marker wrapper
const Wrapper = styled.div<{ hasClick: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.hasClick ? "pointer" : "default")};
  &:hover {
    z-index: 1;
  }
`;

// Marker component
const Marker: React.FC<MarkerProps> = ({ text, onClick }) => {
  return <Wrapper hasClick={!!onClick} title={text} onClick={onClick} />;
};

export default Marker;



// import PropTypes from "prop-types";
// import styled from "styled-components";

// const Wrapper = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   width: 18px;
//   height: 18px;
//   background-color: #000;
//   border: 2px solid #fff;
//   border-radius: 100%;
//   user-select: none;
//   transform: translate(-50%, -50%);
//   cursor: ${(props) => (props.onClick ? "pointer" : "default")};
//   &:hover {
//     z-index: 1;
//   }
// `;

// const Marker = ({ text, onClick }) => <Wrapper alt={text} onClick={onClick} />;

// Marker.defaultProps = {
//   onClick: null,
// };

// Marker.propTypes = {
//   onClick: PropTypes.func,
//   text: PropTypes.string.isRequired,
// };

// export default Marker;
