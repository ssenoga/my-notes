export const initialState = {
  user: {
    id: 1,
    name: "Ssenoga",
    authenticated: false,
    notes: [
      // {
      //   id: 1,
      //   title: "This is my first test",
      //   category: "Learning",
      //   content:
      //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus tortor dictum, maximus neque et, lacinia velit. In eu elit rutrum nibh malesuada iaculis quis vel metus. Suspendisse ac tortor aliquet nisi malesuada aliquam. Duis id nibh accumsan, posuere odio eget, vulputate erat. Donec ut massa turpis. Maecenas a libero nisi"
      // }
    ]
  }
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
    case "ADD_NEW_NOTE":
      return {
        user: {
          id: state.user.id,
          authenticated: state.authenticated,
          name: state.user.name,
          notes: state.user.notes.concat(action.note)
        }
      };

    default:
      return state;
  }
}
