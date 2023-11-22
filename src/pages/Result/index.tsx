import React, { useEffect, useState } from 'react'
import { Card, CardContent, Icon, Typography } from '@mui/material'
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { AxiosError } from 'axios';

import { ResultsService } from '../../core/services/api/results/ResultsService';
import { PageBaseLayout } from '../../core/layout/PageBaseLayout'
import { IResultResponse } from '../../core/models/Result';
import { JwtService } from '../../core/auth/JwtService';

const Result: React.FC = () => {

  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const [result, setResult] = useState<IResultResponse>()
  const { idActivity, idResolution } = useParams()

  useEffect(() => {
    if ((idResolution !== undefined) && (idActivity !== undefined)) {
      ResultsService.getById(idActivity, idResolution, rawAccessToken)
        .then((response) => {
          console.log(response)
          setResult(response as IResultResponse)
        }).catch((error: AxiosError<ProblemDetail>) => {
          console.log("erro")
        })
    }
  }, [rawAccessToken])

  const { t } = useTranslation();

  const successTestCases = result?.testCases.filter((testCase) => testCase?.success)

  return (
    <>
      <PageBaseLayout title={t('result.title')}>

      </PageBaseLayout>

      <Typography><strong>{t('result.time')}</strong>: {result?.time}</Typography>
      <Typography><strong>{t('result.testsPassed')}</strong>: {successTestCases?.length} / {result?.testCases.length}</Typography>
      {result?.error && <Typography><strong>{t('result.error')}</strong>: {result?.error}</Typography>}

      {result?.testCases.map((testCase) => (
        <Card key={testCase?.id} variant="outlined" sx={{ margin: '24px', border: '1px solid #ccc' }}>
          <CardContent>
            <Typography sx={{ display: "flex", alignItems: "center" }}><strong>{t('result.test.name')}</strong>: {testCase?.testName} {testCase?.success ? <Icon sx={{ color: 'green' }}>check</Icon> : <Icon sx={{ color: 'red' }}>clear</Icon>}</Typography>
            {testCase?.info && <Typography><strong>{t('result.test.error')}</strong>: {testCase?.info}</Typography>}
            <Typography><strong>{t('result.test.time')}</strong>: {testCase?.time}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default Result

