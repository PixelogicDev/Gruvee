import MockUser from 'Gruvee/mock/user'
import {
    ADD_PLAYLIST_TO_USER,
    DELETE_PLAYLIST_FROM_USER,
    SET_USER_API_TOKEN,
    SIGN_IN,
} from 'Gruvee/redux/actions/ActionsType'
import {
    AddPlaylistToUser,
    DeletePlaylistFromUser,
    SetUserApiToken,
    SignInUser,
} from 'Gruvee/redux/actions/user/DispatchActions'

// Mock Data Mapper
const mapMockUser = () => {
    return {
        user: {
            ...MockUser,
        },
    }
}

const initialState = mapMockUser()

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_PLAYLIST_TO_USER:
            return {
                ...state,
                user: AddPlaylistToUser(action.data, state.user),
            }
        case DELETE_PLAYLIST_FROM_USER:
            return {
                ...state,
                user: DeletePlaylistFromUser(action.data, state.user),
            }
        case SET_USER_API_TOKEN:
            return {
                ...state,
                user: SetUserApiToken(action.data, state.user),
            }
        case SIGN_IN:
            return {
                ...state,
                user: SignInUser(action.data),
            }
        default:
            return state
    }
}
