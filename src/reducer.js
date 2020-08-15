export const initialState = {
  users: null,
  authenticated: false,
  notes: []
};

export default function reducer(state, action) {
  switch (action.type) {
    case "user_loggedin":
      return {
        user: {
          id: state.user.id,
          authenticated: true,
          name: state.user.name,
          notes: state.user.notes
        }
      };
    case "SET_USER":
      return {
        ...state,
        users: action.user,
        authenticated: true
      };
    case "ADD_NEW_NOTE":
      return {
        users: state.users,
        authenticated: state.authenticated,
        notes: state.notes.concat(action.note)
      };

    default:
      return state;
  }
}
