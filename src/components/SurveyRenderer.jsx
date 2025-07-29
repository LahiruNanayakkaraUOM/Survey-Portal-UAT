/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.css";

const SurveyRenderer = ({ schema, originURL, surveyName, surveyId }) => {
  const survey = new Model(schema);
  const [loading, setLoading] = useState(true);
  const [fnModule, setFnModule] = useState(null);

  useEffect(() => {
    const importFnModule = async (surveyName) => {
      try {
        const fnModule = await import(
          `https://gyde365qualifysurveyimg.blob.core.windows.net/userfunctions/${surveyName
            .replace(/ /g, "_")
            .toLowerCase()}/index.js`
        );
        if (fnModule) {
          await fnModule.fetchFontStyles(surveyId);
          await fnModule.fetchDefaultStyle(originURL);
          setFnModule(fnModule);
          setLoading(false);
        }
      } catch (error) {
        console.warn("Function not found for:", surveyName);
      }
    };
    importFnModule(surveyName);
  }, []);

  useEffect(() => {
    if (fnModule) {
      survey.onComplete.add(async (sender, options) => {
        await fnModule.saveSurveyResults(survey, sender, options, originURL);
      });
    }
  }, [fnModule]);

  if (loading) {
    survey.beginLoading();
    survey.showTitle = false;
    survey.logo = "";
  } else {
    survey.endLoading();
    survey.showTitle = true;
  }
  return <Survey model={survey} />;
};

export default SurveyRenderer;
