import { Journey, Person } from '@app-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addParticipantToJourneyThunk,
  createJourney,
  loadJourneyById,
  loadJourneys,
  updateJourneyThunk
} from './thunks';

interface JourneyState {
  journeys: Journey[];
  currentJourney: Journey | null;
  isLoading: boolean;
}

const initialState: JourneyState = {
  journeys: [],
  currentJourney: null,
  isLoading: false,
};

const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    setJourneys: (state, action: PayloadAction<Journey[]>) => {
      state.journeys = action.payload;
    },
    setCurrentJourney: (state, action: PayloadAction<Journey | null>) => {
      state.currentJourney = action.payload;
    },
    addParticipantToCurrentJourney: (state, action: PayloadAction<Person>) => {
      if (state.currentJourney) {
        state.currentJourney.participants.push(action.payload);
      }
    },
    setJourneyLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all journeys
      .addCase(loadJourneys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadJourneys.fulfilled, (state, action) => {
        state.journeys = action.payload;
        state.isLoading = false;
      })
      .addCase(loadJourneys.rejected, (state) => {
        state.isLoading = false;
      })
      // Load journey by ID
      .addCase(loadJourneyById.fulfilled, (state, action) => {
        state.currentJourney = action.payload;
      })
      // Create journey
      .addCase(createJourney.fulfilled, (state, action) => {
        state.journeys.unshift(action.payload);
      })
      // Update journey
      .addCase(updateJourneyThunk.fulfilled, (state, action) => {
        const index = state.journeys.findIndex(j => j.id === action.payload.id);
        if (index !== -1) {
          state.journeys[index] = action.payload;
        }
        if (state.currentJourney?.id === action.payload.id) {
          state.currentJourney = action.payload;
        }
      })
      // Add participant to journey
      .addCase(addParticipantToJourneyThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.journeys.findIndex(j => j.id === action.payload!.id);
          if (index !== -1) {
            state.journeys[index] = action.payload;
          }
          if (state.currentJourney?.id === action.payload.id) {
            state.currentJourney = action.payload;
          }
        }
      });
      // Note: updateJourneyData and addParticipant thunks are commented out
      // as the corresponding database functions are not implemented
      // .addCase(updateJourneyData.fulfilled, (state, action) => {
      //   const index = state.journeys.findIndex(j => j.id === action.payload.id);
      //   if (index !== -1) {
      //     state.journeys[index] = action.payload;
      //   }
      //   if (state.currentJourney?.id === action.payload.id) {
      //     state.currentJourney = action.payload;
      //   }
      // })
      // .addCase(addParticipant.fulfilled, (state, action) => {
      //   if (action.payload) {
      //     const index = state.journeys.findIndex(j => j.id === action.payload!.id);
      //     if (index !== -1) {
      //       state.journeys[index] = action.payload;
      //     }
      //     if (state.currentJourney?.id === action.payload.id) {
      //       state.currentJourney = action.payload;
      //     }
      //   }
      // });
  },
});

export const {
  setJourneys,
  setCurrentJourney,
  addParticipantToCurrentJourney,
  setJourneyLoading,
} = journeySlice.actions;

export default journeySlice.reducer;
