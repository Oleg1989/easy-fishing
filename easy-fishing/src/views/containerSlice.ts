import { ActionCreatorWithPayload, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { ContainerState } from './interface/InterfaceContainerState';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";
import { UserApp } from './interface/InterfaceUserApp';
import { Location } from '../views/interface/InterfaceLocation';

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
};

export const loginUser = createAsyncThunk(
  'container/loginUser',
  async (
    userApp: {
      email: string,
      password: string,
      error: (message: string) => void,
    }) => {
    const auth = getAuth();
    let userToken: string | null = null;
    let uId: string | null = null;
    await signInWithEmailAndPassword(auth, userApp.email, userApp.password)
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
        userApp.error(errorMessage);
      });
    return { token: userToken, id: uId };;
  }
);

export const registrationUser = createAsyncThunk(
  'container/registrationUser',
  async (
    userApp: {
      name: string,
      email: string,
      password: string,
      locations: {},
      error: (message: string) => void,
    }) => {
    const auth = getAuth();
    const db = getDatabase();
    let userToken: string | null = null;
    let uId: string | null = null;
    await createUserWithEmailAndPassword(auth, userApp.email, userApp.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        uId = user.uid;
        await user.getIdToken()
          .then((token) => {
            userToken = token;
          }
          )
        await set(ref(db, 'users/' + uId), {
          name: userApp.name,
          email: user.email,
          location: userApp.locations
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        userApp.error(errorMessage);
      });
    return { token: userToken, id: uId };
  }
);

export const addLocathinDatabase = createAsyncThunk(
  'container/addLocathinDatabase',
  async (marker: { location: Location }) => {
    const db = getDatabase();
    const auth = getAuth();

    const myUserId = auth.currentUser?.uid;
    await set(ref(db, '/users/' + myUserId + '/locations/' + marker.location.id), marker.location);
    return marker;
  }
);

export const getUserFromDatabase = createAsyncThunk(
  'container/getUserFromDatabase',
  async (uId: string | null) => {
    const db = getDatabase();
    const dbRef = ref(db);

    let userData: UserApp | null = await get(child(dbRef, `users/${uId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        return data;
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
    return userData;
  }
);

export const getPublicLocations = createAsyncThunk(
  'container/getPublicLocations',
  async () => {
    const dbRef = ref(getDatabase());

    const locations: Location[] = [];
    await get(child(dbRef, `users`)).then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (let keyUser in users) {
          if (users[keyUser].locations) {
            for (let key in users[keyUser].locations) {
              if (users[keyUser].locations[key].publicLocation) {
                locations.push(users[keyUser].locations[key]);
              }
            }
          }
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
    return locations;
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
      });
  },
});

export const {
  turnOnAddLocation,
  isAuthenticated,
  isNotAuthenticated,
  disableAddLocation,
  isError,
  isMessage
} = containerSlice.actions;

export const selectPublicLocations = (state: RootState) => state.container.publicLocations;
export const selectUserLocations = (state: RootState) => state.container.user?.locations;
export const selectIsAuthenticated = (state: RootState) => state.container.isAuthenticated;
export const selectFlagAddLocation = (state: RootState) => state.container.flagAddLocation;
export const selectUser = (state: RootState) => state.container.user;
export const selectUId = (state: RootState) => state.container.uId;
export const selectShowError = (state: RootState) => state.container.showError;
export const selectErrorMessage = (state: RootState) => state.container.errorMessage;

export default containerSlice.reducer;
