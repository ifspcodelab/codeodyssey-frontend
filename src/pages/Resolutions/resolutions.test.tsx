import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { test } from 'vitest';
import Resolutions from './index';
import { ResolutionStatus } from '../../core/models/ResolutionStatus';

const resolutions = [
  {
    id: "123e4567-e89b-12d3-a456-426655440001",
    resolutionFile: "cGFja2FnZSBjb20uZXhhbXBsZS5oZWxsb3dvcmxkLmhlbGxvLndvcmxkOwoKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuYm9vdC5TcHJpbmdBcHBsaWNhdGlvbjsKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuYm9vdC5hdXRvY29uZmlndXJlLlNwcmluZ0Jvb3RBcHBsaWNhdGlvbjsKCkBTcHJpbmdCb290QXBwbGljYXRpb24KcHVibGljIGNsYXNzIEhlbGxvV29ybGRBcHBsaWNhdGlvbiB7CgoJcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykgewoJCVNwcmluZ0FwcGxpY2F0aW9uLnJ1bihIZWxsb1dvcmxkQXBwbGljYXRpb24uY2xhc3MsIGFyZ3MpOwoJCVN5c3RlbS5vdXQucHJpbnRsbigiSGVsbG8gd29ybGQiKTsKCX0KCgoKfQo=",
    status: ResolutionStatus.WAITING_FOR_RESULTS,
    submitDate: "2023-10-10T15:30:00Z",
    student: {
      createdAt: "2023-11-07T18:16:11.268703Z",
      email: "peterparker@email.com",
      id: "7a87dd7b-20b3-4bbe-a62e-a7c8e3229dcf",
      name: "Peter Parker",
      role: "STUDENT"
    },
    activity: {
      description: "Description",
      extension: ".java",
      id: "11e05918-8083-4d1a-94bb-3f2832050cd9",
      initialFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      solutionFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      startDate: new Date('2023-11-07T18:46:28.256319Z'),
      endDate: new Date('2024-01-01T10:10:10.100001Z'),
      testFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      title: "Activity"
    }
  },
  {
    id: "123e4567-e89b-12d3-a456-426655440002",
    resolutionFile: "cGFja2FnZSBjb20uZXhhbXBsZS5oZWxsb3dvcmxkLmhlbGxvLndvcmxkOwoKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuYm9vdC5TcHJpbmdBcHBsaWNhdGlvbjsKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuYm9vdC5hdXRvY29uZmlndXJlLlNwcmluZ0Jvb3RBcHBsaWNhdGlvbjsKCkBTcHJpbmdCb290QXBwbGljYXRpb24KcHVibGljIGNsYXNzIEhlbGxvV29ybGRBcHBsaWNhdGlvbiB7CgoJcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykgewoJCVNwcmluZ0FwcGxpY2F0aW9uLnJ1bihIZWxsb1dvcmxkQXBwbGljYXRpb24uY2xhc3MsIGFyZ3MpOwoJCVN5c3RlbS5vdXQucHJpbnRsbigiSGVsbG8gd29ybGQiKTsKCX0KCgoKfQo=",
    status: ResolutionStatus.EXECUTED_SUCCESS,
    submitDate: "2023-10-12T18:30:00Z",
    student: {
      createdAt: "2023-11-07T18:16:11.268703Z",
      email: "peterparker@email.com",
      id: "7a87dd7b-20b3-4bbe-a62e-a7c8e3229dcf",
      name: "Peter Parker",
      role: "STUDENT"
    },
    activity: {
      description: "Description",
      extension: ".java",
      id: "11e05918-8083-4d1a-94bb-3f2832050cd9",
      initialFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      solutionFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      startDate: new Date('2023-11-07T18:46:28.256319Z'),
      endDate: new Date('2024-01-01T10:10:10.100001Z'),
      testFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      title: "Activity"
    }
  },
  {
    id: "123e4567-e89b-12d3-a456-426655440003",
    resolutionFile: "cGFja2FnZSBjb20uZXhhbXBsZS5oZWxsb3dvcmxkLmhlbGxvLndvcmxkOwoKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuYm9vdC5TcHJpbmdBcHBsaWNhdGlvbjsKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuYm9vdC5hdXRvY29uZmlndXJlLlNwcmluZ0Jvb3RBcHBsaWNhdGlvbjsKCkBTcHJpbmdCb290QXBwbGljYXRpb24KcHVibGljIGNsYXNzIEhlbGxvV29ybGRBcHBsaWNhdGlvbiB7CgoJcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykgewoJCVNwcmluZ0FwcGxpY2F0aW9uLnJ1bihIZWxsb1dvcmxkQXBwbGljYXRpb24uY2xhc3MsIGFyZ3MpOwoJCVN5c3RlbS5vdXQucHJpbnRsbigiSGVsbG8gd29ybGQiKTsKCX0KCgoKfQo=",
    status: ResolutionStatus.EXECUTED_ERROR,
    submitDate: "2023-10-11T16:30:00Z",
    student: {
      createdAt: "2023-11-07T18:16:11.268703Z",
      email: "peterparker@email.com",
      id: "7a87dd7b-20b3-4bbe-a62e-a7c8e3229dcf",
      name: "Peter Parker",
      role: "STUDENT"
    },
    activity: {
      description: "Description",
      extension: ".java",
      id: "11e05918-8083-4d1a-94bb-3f2832050cd9",
      initialFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      solutionFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      startDate: new Date('2023-11-07T18:46:28.256319Z'),
      endDate: new Date('2024-01-01T10:10:10.100001Z'),
      testFile: "DQpwdWJsaWMgY2xhc3MgVmVpY3VsbyB7DQoJcHJpdmF0ZSBmbG9hdCBUb3RhbENvbWJ1c3RpdmVsOw0KCQ0KCXB1YmxpYyBWZWljdWxvKCkge30NCn0NCg==",
      title: "Activity"
    }
  }

]

function renderActivities() {
  return render(
    <BrowserRouter>
      <Resolutions resolutions={resolutions} fileType={'.java'} />
    </BrowserRouter>
  );
}

describe("Resolutions", () => {
  test("Should be able to render the card component on the screen", async () => {
    const { findAllByText } = renderActivities()

    const sendElements = await findAllByText(/Send/);
    expect(sendElements.length).toBeGreaterThan(0);

    const statusElement = await findAllByText(/Status/);
    expect(statusElement.length).toBeGreaterThan(0);

    const fileSendedElement = await findAllByText(/File Sended/);
    expect(fileSendedElement.length).toBeGreaterThan(0);

    const downloadFileElement = await findAllByText(/Download File/);
    expect(downloadFileElement.length).toBeGreaterThan(0);
  })

  test("Should be able to render Resolution with status Executed Success", () => {
    const { getByText } = renderActivities()

    expect(getByText(/10\/12\/2023/)).toBeInTheDocument();
    expect(getByText(/3:30:00 PM/)).toBeInTheDocument();
    expect(getByText(/Executed Success/)).toBeInTheDocument();
    expect(getByText(/Tests/)).toBeInTheDocument();
    expect(getByText(/Pass/)).toBeInTheDocument();
    expect(getByText("Error: 0")).toBeInTheDocument();
  })

  test("Should be able to render Resolution with status Executed Error", () => {
    const { getByText } = renderActivities()

    expect(getByText(/10\/11\/2023/)).toBeInTheDocument();
    expect(getByText(/1:30:00 PM/)).toBeInTheDocument();
    expect(getByText(/Executed Error/)).toBeInTheDocument();
    expect(getByText(/Error in execution/)).toBeInTheDocument();
  })
})
