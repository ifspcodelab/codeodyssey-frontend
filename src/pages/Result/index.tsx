import React from 'react'
import { PageBaseLayout } from '../../core/layout/PageBaseLayout'
import { Card, CardContent, Icon, Typography } from '@mui/material'
import { useTranslation } from "react-i18next";


const Result: React.FC = () => {
  const result = {
    id: "3f7c1f1f-0d35-4b2b-85b1-6b27c09d3b46",
    name: "TestSuiteExample",
    time: 444,
    activityId: "789012",
    error: null,
    testCases: [
      {
        id: "7a6a0e88-ef9a-4ea6-b34b-ff126c7b5bc9",
        testName: "TestCase1",
        success: true,
        info: null,
        time: 200
      },
      {
        id: "e1565c35-1063-4b5b-9d72-8e14a07f0cc7",
        testName: "TestCase2",
        success: false,
        info: "Test failed due to assertion error",
        time: 144
      },
      {
        id: "ba79e017-9c2a-45f3-ba50-7d0f4b380d3d",
        testName: "TestCase3",
        success: true,
        info: null,
        time: 100
      }
    ]
  }

  const { t } = useTranslation();

  const successTestCases = result.testCases.filter((testCase) => testCase.success)

  return (
    <>
      <PageBaseLayout title={t('result.title')}>

      </PageBaseLayout>

      <Typography><strong>{t('result.time')}</strong>: {result.time}</Typography>
      <Typography><strong>{t('result.testsPassed')}</strong>: {successTestCases.length} / {result.testCases.length}</Typography>
      {result.error && <Typography><strong>{t('result.error')}</strong>: {result.error}</Typography>}

      {result.testCases.map((testCase) => (
        <Card key={testCase.id} variant="outlined" sx={{ margin: '24px', border: '1px solid #ccc' }}>
          <CardContent>
            <Typography sx={{ display: "flex", alignItems: "center" }}><strong>{t('result.test.name')}</strong>: {testCase.testName} {testCase.success ? <Icon sx={{ color: 'green' }}>check</Icon> : <Icon sx={{ color: 'red' }}>clear</Icon>}</Typography>
            {testCase.info && <Typography><strong>{t('result.test.error')}</strong>: {testCase.info}</Typography>}
            <Typography><strong>{t('result.test.time')}</strong>: {testCase.time}</Typography>
          </CardContent>
        </Card>
      ))}
    </>

  )
}

export default Result