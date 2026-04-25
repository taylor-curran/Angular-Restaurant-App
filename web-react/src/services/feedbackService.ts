import { Feedback } from '../shared/types';
import { baseURL } from '../shared/baseurl';
import { httpPost } from './http';

export async function putFeedback(feedback: Feedback): Promise<Feedback> {
  // Mirrors FeedbackService.putFeedback: POST /feedback with a JSON body that
  // contains the same field names the Angular form sends.
  return httpPost<Feedback>(`${baseURL}feedback`, feedback);
}
