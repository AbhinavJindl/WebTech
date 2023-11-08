import { configureStore } from '@reduxjs/toolkit';
import resultsReducer from './features/resultsSlice';
import itemDetailReducer from './features/itemDetailSlice';


// "react app with redux store manager and react-bootstrap" next (3 lines and other redux files). ChatGPT, 25 Sep. version, OpenAI, 20 Oct. 2023, chat.openai.com/chat.
export const store = configureStore({
  reducer: {
    results: resultsReducer,
    itemDetail: itemDetailReducer,
  }
});
