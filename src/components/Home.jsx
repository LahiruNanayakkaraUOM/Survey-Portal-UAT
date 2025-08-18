import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SurveyRenderer from "./SurveyRenderer";

const Home = () => {
  const [surveyJson, setSurveyJson] = useState({});
  const [originUrl, setOriginUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { slogan } = useParams();

  useEffect(() => {
    const getSchema = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_AZURE_SURVEYJSON_FUNCTION_URL}?code=${
            import.meta.env.VITE_AZURE_SURVEYJSON_FUNCTION_API_CODE
          }&slogan=${slogan}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const schema = data?.content;
          console.log(schema);
          setSurveyJson(schema);
          setOriginUrl(data?.originUrl);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getSchema();
  }, []);
  return (
    <>
      {loading ? (
        <p></p>
      ) : surveyJson && originUrl ? (
        <SurveyRenderer
          schema={surveyJson}
          originURL={originUrl}
          surveySlogan={slogan}
        />
      ) : (
        <p>Something went wrong</p>
      )}
      <div
        style={{ height: "10%", justifySelf: "center", fontSize: "12px" }}
        id="banner"
      >
        <span>GYDE365 by&nbsp;&nbsp;</span>
        <img
          alt="Seer 365"
          src="https://gyde365-discover.powerappsportals.com/FooterLogo.png"
          style={{ height: "20px" }}
        />
        <span>&nbsp;&nbsp;Seer 365</span>
      </div>
    </>
  );
};

export default Home;
