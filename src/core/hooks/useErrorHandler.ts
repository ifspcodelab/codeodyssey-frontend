import { useState } from 'react';
import { AxiosError } from 'axios';

export function useErrorHandler() {
  const [errorType, setErrorType] = useState('');
  const [openError, setOpenError] = useState(false);

  const handleError = (error: AxiosError) => {
    let responseStatus: number;
    let problemDetail: ProblemDetail = { title: '', detail: '', instance: '', status: 0, type: '' };

    if (error.response) {
      problemDetail = error.response.data as ProblemDetail
      responseStatus = problemDetail.status
    
      switch (responseStatus) {
        case 400:  
          if (problemDetail.detail == "must be a future date") {
            setErrorType('invalidStartDate')
          } else {
            setErrorType('invalid')
          }
          break;
        case 403: 
          if (problemDetail.detail == "Bad credentials") {
            setErrorType('invalidLoginOrEmail');
          } else {
            setErrorType('unauthorized')
          }
          break
        case 404: 
          setErrorType('notFound')
          break
        case 409: 
          if (problemDetail.title === "Course Already exists") {
            setErrorType('courselAlreadyExists')
          } else if (problemDetail.title == "User Already exists") {
              setErrorType('emailAlreadyExists')
          } else if (problemDetail.title === "Course Slug not found") {
            setErrorType('slugNotFound')
          } else if (problemDetail.title === "Resolution Submit date later than its activity end date") {
            setErrorType('unexpected')
          } else if (problemDetail.detail === "WAITING_FOR_RESULTS") {
            setErrorType('waitingForResults')
          }
          break;
        case 422: 
          setErrorType('resendEmailDelay');  
          break
        default: setErrorType('networkError');
    }
    setOpenError(true);
  }}

  const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }
    setOpenError(false);
  };

  return { handleError, openError, errorType, handleCloseError };
}