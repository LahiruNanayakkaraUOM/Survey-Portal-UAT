import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SurveyRenderer from "./SurveyRenderer";

const Home = () => {
  const [surveyJson, setSurveyJson] = useState({});
  const [originUrl, setOriginUrl] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const getSchema = async () => {
      try {
        const response = await fetch(
          `https://qualify-fapp-surveyjs-djduaueze5grfec5.uksouth-01.azurewebsites.net/api/RetriveSurveyJsonFromDataverse?code=<API_CODE>&id=${id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const schema = data?.content;
          console.log(schema);
          setSurveyJson(schema);
          setOriginUrl(data?.originUrl);
          setSurveyName(data?.name);
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
      ) : surveyJson && originUrl && surveyName ? (
        <SurveyRenderer
          schema={surveyJson}
          originURL={originUrl}
          surveyName={surveyName}
          surveyId={id}
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
