import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { ContainerState } from './interface/InterfaceContainerState';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { UserApp } from './interface/InterfaceUserApp';
import { Location } from '../views/interface/InterfaceLocation';

const initialState: ContainerState = {
  uId: null,
  uIdStatus: 'No user id',
  isAuthenticated: false,
  isAuthenticatedStatus: 'Is not Authenticated',
  flagAddLocation: false,
  flagAddLocationStatus: 'Not activated',
  user: null,
  userStatus: 'No user',
  publicLocations: [],
  publicLocationsStatus: 'No locations',
};

export const loginUser = createAsyncThunk(
  'container/registrationUser',
  async (user: { email: string, password: string }) => {
    const auth = getAuth();
    let userToken: string | null = null;
    let uId: string | null = null;
    await signInWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        uId = user.uid;
        await user.getIdToken()
          .then((token) => {
            userToken = token;
          }
          )
      })
      .catch((error: Error) => {
        const errorMessage = error.message;
        alert(errorMessage)
      });
    return { token: userToken, id: uId };;
  }
);

export const registrationUser = createAsyncThunk(
  'container/loginUser',
  async (user: UserApp) => {
    const auth = getAuth();
    const db = getDatabase();
    let userToken: string | null = null;
    let uId: string | null = null;
    await createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        uId = user.uid;
        await user.getIdToken()
          .then((token) => {
            userToken = token;
          }
          )
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage)
      });
    await set(ref(db, 'users/' + uId), {
      name: user.name,
      email: user.email,
      location: user.locations
    });
    return { token: userToken, id: uId };
  }
);
export const addLocathinDatabase = createAsyncThunk(
  'container/addLocathinDatabase',
  async (marker: { location: Location, uid: string }) => {
    const db = getDatabase();
    await set(ref(db, '/users/' + marker.uid + '/locations/' + marker.location.id), marker.location);
    return marker;
  }
);

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
    isAuthenticated: (state) => {
      state.isAuthenticated = true;
      state.isAuthenticatedStatus = 'Is authenticated'
    },
    isNotAuthenticated: (state) => {
      state.isAuthenticated = false;
      state.isAuthenticatedStatus = 'Is not authenticated'
    },
    getUser: (state, action) => {
      state.user = action.payload;
      state.userStatus = 'User added';
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
          const token: string = JSON.stringify(action.payload.token);
          localStorage.setItem('token', token);
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
          const token: string = JSON.stringify(action.payload.token);
          localStorage.setItem('token', token);
        }
      })
      .addCase(addLocathinDatabase.pending, (state) => {
        state.userStatus = 'loading...';
      })
      .addCase(addLocathinDatabase.fulfilled, (state, action) => {
        state.user = null;
        state.userStatus = 'No user';
      });
  },
});

export const { turnOnAddLocation, isAuthenticated, isNotAuthenticated, disableAddLocation, getUser } = containerSlice.actions;

export const selectPublicLocations = (state: RootState) => state.container.publicLocations;
export const selectUserLocations = (state: RootState) => state.container.user?.locations;
export const selectIsAuthenticated = (state: RootState) => state.container.isAuthenticated;
export const selectFlagAddLocation = (state: RootState) => state.container.flagAddLocation;
export const selectUser = (state: RootState) => state.container.user;
export const selectUId = (state: RootState) => state.container.uId;

export default containerSlice.reducer;
