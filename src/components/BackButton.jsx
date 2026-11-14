import { useNavigate } from "react-router-dom";
import Button from "./Button";
const BackButton = ({ btnType }) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        navigate("/app/cities");
      }}
      btnType={btnType}
    >
      &larr; Back
    </Button>
  );
};

export default BackButton;
