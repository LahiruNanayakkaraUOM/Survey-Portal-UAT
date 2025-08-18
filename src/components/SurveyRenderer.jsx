/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.css";

const SurveyRenderer = ({ schema, originURL, surveySlogan }) => {
  const model = schema ? JSON.parse(schema) : {};
  const survey = new Model(model);
  const showTitle = survey.showTitle;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fnModule, setFnModule] = useState(null);

  useEffect(() => {
    const importFnModule = async (surveySlogan) => {
      try {
        const fnModule = await import(
          `${import.meta.env.VITE_AZURE_BLOB_URL}/${surveySlogan}/index.js`
        );
        if (fnModule) {
          await fnModule.fetchFontStyles(surveySlogan);
          await fnModule.fetchDefaultStyle(originURL);
          setFnModule(fnModule);
          setLoading(false);
        }
      } catch (error) {
        setError(`Error loading module: ${error.message}`);
        setLoading(false);
        console.warn("Function module not found for:", surveySlogan);
      }
    };
    importFnModule(surveySlogan);
  }, []);

  useEffect(() => {}, [fnModule]);

  if (survey) {
    survey.onCurrentPageChanged.add((sender, options) => {
      console.log("Current page no:", options.newCurrentPage.num);
    });
  }

  if (fnModule) {
    survey.onComplete.add(async (sender, options) => {
      await fnModule.saveSurveyResults(survey, sender, options, originURL);
    });
  }

  if (loading) {
    survey.beginLoading();
    survey.showTitle = false;
    survey.logo = "";
  } else {
    survey.endLoading();
    survey.showTitle = showTitle;
  }
  return !error ? <Survey model={survey} /> : <div>Error: {error}</div>;
};

export default SurveyRenderer;
