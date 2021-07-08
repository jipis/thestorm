import { useEffect, useState } from "react";

const FetchTesting = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTheData();
  }, []);

  const getTheData = async () => {
    const response = await fetch("/api/user/v1/me");
    const jsonData = await response.json();
    setData(jsonData);
  };

  return (
    <pre className="listofthings">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default FetchTesting;
