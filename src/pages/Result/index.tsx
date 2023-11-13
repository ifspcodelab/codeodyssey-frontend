import React from 'react'
import { PageBaseLayout } from '../../core/layout/PageBaseLayout'
import { Card, CardContent, Icon, Typography } from '@mui/material'


const Result: React.FC = () => {
  const result = {
    id: "3f7c1f1f-0d35-4b2b-85b1-6b27c09d3b46",
    name: "TestSuiteExample",
    time: 1636565445000,
    activityId: "789012",
    error: null,
    testCases: [
      {
        id: "7a6a0e88-ef9a-4ea6-b34b-ff126c7b5bc9",
        testName: "TestCase1",
        success: true,
        info: null,
        time: 1636565460000
      },
      {
        id: "e1565c35-1063-4b5b-9d72-8e14a07f0cc7",
        testName: "TestCase2",
        success: false,
        info: "Test failed due to assertion error",
        time: 1636565475000
      },
      {
        id: "ba79e017-9c2a-45f3-ba50-7d0f4b380d3d",
        testName: "TestCase3",
        success: true,
        info: null,
        time: 1636565490000
      }
    ]
  }

  const successTestCases = result.testCases.filter((testCase) => testCase.success)

  return (
    <>
      <PageBaseLayout title="Result">

      </PageBaseLayout>

      <Typography><strong>Total Time</strong>: {result.time}</Typography>
      <Typography><strong>Tests Passed</strong>: {successTestCases.length} / {result.testCases.length}</Typography>
      {result.error && <Typography>Error: {result.error}</Typography>}

      {result.testCases.map((testCase) => (
        <Card key={testCase.id} variant="outlined" sx={{ margin: '24px', border: '1px solid #ccc' }}>
          <CardContent>
            <Typography sx={{ display: "flex", alignItems: "center" }}><strong>Test Name</strong>: {testCase.testName} {testCase.success ? <Icon sx={{ color: 'green' }}>check</Icon> : <Icon sx={{ color: 'red' }}>clear</Icon>}</Typography>
            {testCase.info && <Typography><strong>Error</strong>: {testCase.info}</Typography>}
            <Typography><strong>Time</strong>: {testCase.time}</Typography>
          </CardContent>
        </Card>
      ))}
    </>

  )
}

export default Result