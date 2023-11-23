import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { AxiosError } from "axios";

import { ResultsService } from "../services/api/results/ResultsService";
import { IResultResponse } from "../models/Result";
import { JwtService } from "../auth/JwtService";

interface IComponentTestProps {
  resolutionId: string;
  activityId: string;
}

const TestPassOrError: React.FC<IComponentTestProps> = ({ resolutionId, activityId }) => {
  const { t } = useTranslation();

  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const [result, setResult] = useState<IResultResponse>()

  useEffect(() => {
    if ((resolutionId !== undefined) && (activityId !== undefined)) {
      ResultsService.getById(activityId, resolutionId, rawAccessToken)
        .then((response) => {
          setResult(response as IResultResponse)
        }).catch((error: AxiosError<ProblemDetail>) => {
          console.log("erro")
        })
    }
  }, [rawAccessToken])

  const [successTest, setSuccessTest] = useState(0)
  const [errorTest, setErrorTest] = useState(0)
  const hasEffectRun = useRef(false);
  useEffect(() => {
    if (!hasEffectRun.current && result && result.testCases) {
      result.testCases.forEach((testcase) => {
        if (testcase.success) {
          setSuccessTest((prevSuccessTest) => prevSuccessTest + 1);
        } else {
          setErrorTest((prevErrorTest) => prevErrorTest + 1);
        }
      });

      hasEffectRun.current = true;
    }
  }, [result])


  return (
    <Typography><strong>{t('resolution.tests')}</strong>: {successTest + errorTest} <span style={{ color: 'green' }}>{t('resolution.testPass')}: {successTest} </span><span style={{ color: 'red' }}>{t('resolution.testError')}: {errorTest}</span></Typography>
  )
}

export default TestPassOrError