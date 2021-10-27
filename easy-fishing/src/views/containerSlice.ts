import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { ContainerState } from './interface/InterfaceContainerState';
import { addLocathinDatabase, deleteLocathinDatabase, getPublicLocations, getUserFromDatabase, loginUser, registrationUser, updateLocathinDatabase } from './containerAPI';

const initialState: ContainerState = {
  uId: null,
  uIdStatus: 'No user id',
  isAuthenticated: false,
  isAuthenticatedStatus: 'Is not Authenticated',
  flagAddLocation: false,
  flagAddLocationStatus: 'Not activated',
  user: {
    name: '',
    email: '',
    password: '',
    locations: {},
  },
  userStatus: 'No user',
  publicLocations: [],
  publicLocationsStatus: 'No locations',
  showError: false,
  showErrorStatus: 'No error',
  errorMessage: '',
  errorMessageStatus: 'No message',
  modalUpdate: false,
  modalUpdateStatus: 'Closed modal window',
  mapStyle: JSON.parse(localStorage.getItem('mapStyle')!),
  mapStyleStatus: 'Default',
};

export const containerSlice = createSlice({
  name: 'container',
  initialState,
  reducers: {
    turnOnAddLocation: (state) => {
      state.flagAddLocation = true;
      state.flagAddLocationStatus = 'Activated';
    },
    disableAddLocation: (state) => {
      state.flagAddLocation = false;
      state.flagAddLocationStatus = 'Not activated';
    },
    isAuthenticated: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.isAuthenticatedStatus = 'Is authenticated';
      state.uIdStatus = 'User id added';
      state.uId = action.payload;
    },
    isNotAuthenticated: (state) => {
      state.isAuthenticated = false;
      state.isAuthenticatedStatus = 'Is not authenticated';
      localStorage.removeItem('token');
      state.uId = null;
      localStorage.removeItem('uId');
      state.uIdStatus = 'User id deleted';
      state.user!.locations = {};
      state.userStatus = 'Locations deleted';
    },
    isError: (state) => {
      state.showError = !state.showError;
      state.showErrorStatus = 'Error';
    },
    isMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
      state.errorMessageStatus = 'Message';
    },
    showModal: (state) => {
      state.modalUpdate = true;
      state.modalUpdateStatus = 'Oped modal window';
    },
    closeModal: (state) => {
      state.modalUpdate = false;
      state.modalUpdateStatus = 'Closed modal window';
    },
    //Attention needs to change type any
    changeMapStyle: (state, action: PayloadAction<{ newStyle: any, name: string }>) => {
      state.mapStyle = action.payload.newStyle;
      state.mapStyleStatus = action.payload.name;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registrationUser.pending, (state) => {
        state.isAuthenticatedStatus = 'loading...';
      })
      .addCase(registrationUser.fulfilled, (state, action) => {
        if (action.payload.token) {
          state.isAuthenticatedStatus = 'Is registered';
          state.isAuthenticated = true;
          state.uIdStatus = 'User id added';
          state.uId = action.payload.id;
          localStorage.setItem('uId', action.payload.id!);
          localStorage.setItem('token', action.payload.token!);
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthenticatedStatus = 'loading...';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.token) {
          state.isAuthenticatedStatus = 'Is registered';
          state.isAuthenticated = true;
          state.uIdStatus = 'User id added';
          state.uId = action.payload.id;
          localStorage.setItem('uId', action.payload.id!);
          localStorage.setItem('token', action.payload.token!);
        }
      })
      .addCase(addLocathinDatabase.pending, (state) => {
        state.userStatus = 'loading...';
      })
      .addCase(addLocathinDatabase.fulfilled, (state, action) => {
        state.user!.locations = { ...state.user!.locations, [action.payload.location.id]: action.payload.location };
        state.userStatus = 'Location added';
      }
      )
      .addCase(getUserFromDatabase.pending, (state) => {
        state.userStatus = 'loading...';
      })
      .addCase(getUserFromDatabase.fulfilled, (state, action) => {
        state.user = {
          ...state.user!,
          name: action.payload?.name!,
          email: action.payload?.email!,
          locations: { ...action.payload?.locations! }
        };
        state.publicLocations = [];
        state.userStatus = 'User added';
      })
      .addCase(getPublicLocations.pending, (state) => {
        state.publicLocationsStatus = 'loading...';
      })
      .addCase(getPublicLocations.fulfilled, (state, action) => {
        state.publicLocations = [...action.payload];
        state.publicLocationsStatus = 'Locations added';
      })
      .addCase(deleteLocathinDatabase.pending, (state) => {
        state.userStatus = 'loading...';
      })
      .addCase(deleteLocathinDatabase.fulfilled, (state, action) => {
        for (let key in state.user?.locations) {
          if (key === action.payload) {
            delete state.user?.locations[key];
          }
        }
        state.userStatus = 'Delete user location';
      })
      .addCase(updateLocathinDatabase.pending, (state) => {
        state.userStatus = 'loading...';
      })
      .addCase(updateLocathinDatabase.fulfilled, (state, action) => {
        for (let key in state.user?.locations) {
          if (key === action.payload.location.id) {
            state.user!.locations[key] = { ...action.payload.location };
          }
        }
        state.userStatus = 'Delete user location';
      });
  },
});

export const {
  turnOnAddLocation,
  isAuthenticated,
  isNotAuthenticated,
  disableAddLocation,
  isError,
  isMessage,
  showModal,
  closeModal,
  changeMapStyle
} = containerSlice.actions;

export const selectPublicLocations = (state: RootState) => state.container.publicLocations;
export const selectUserLocations = (state: RootState) => state.container.user?.locations;
export const selectIsAuthenticated = (state: RootState) => state.container.isAuthenticated;
export const selectFlagAddLocation = (state: RootState) => state.container.flagAddLocation;
export const selectUser = (state: RootState) => state.container.user;
export const selectUId = (state: RootState) => state.container.uId;
export const selectShowError = (state: RootState) => state.container.showError;
export const selectErrorMessage = (state: RootState) => state.container.errorMessage;
export const selectModalUpdate = (state: RootState) => state.container.modalUpdate;
export const selectMapStyle = (state: RootState) => state.container.mapStyle;

export default containerSlice.reducer;
