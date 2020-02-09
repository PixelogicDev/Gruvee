// JMSWRNR - "I'm gonna try to actually write code now ™"(01/31/20)
import {
    ADD_SONG,
    ADD_SONG_COMMENT,
    BULK_COMMENTS_DELETE,
    DELETE_SONG,
    DELETE_SONG_COMMENT,
    FETCH_SONGS,
} from 'Gruvee/Redux/Actions/ActionsType'
import {
    DeletePlaylistSong,
    AddPlaylistSong,
} from 'Gruvee/Redux/Actions/Playlists/PlaylistActions'

// Action Creators
const addSong = song => {
    return {
        type: ADD_SONG,
        data: song,
    }
}

const addSongComment = (commentId, songId) => {
    return {
        type: ADD_SONG_COMMENT,
        data: { commentId, songId },
    }
}

const bulkCommentsDelete = commentIds => {
    return {
        type: BULK_COMMENTS_DELETE,
        data: commentIds,
    }
}

const deleteSong = songId => {
    return {
        type: DELETE_SONG,
        data: songId,
    }
    // Remaiten - "Just dont mess it up right here, if you mess this up you're doomed" (02/05/20)
}

const deleteSongComment = (commentId, songId) => {
    return {
        type: DELETE_SONG_COMMENT,
        data: { commentId, songId },
    }
}

const fetchSongs = songs => {
    return {
        type: FETCH_SONGS,
        data: songs,
    }
}

// Thunks
export const AddSong = (playlistId, song) => {
    return (dispatch, getState) => {
        // Add songs to SongsDataReducer
        dispatch(addSong(song))

        // Update playlist in PlaylistsDataReducer
        dispatch(AddPlaylistSong(song.id, playlistId))
    }
}

export const AddSongComment = (commentId, songId) => {
    return (dispatch, getState) => {
        dispatch(addSongComment(commentId, songId))
    }
}

export const DeleteSong = (playlistId, songId) => {
    return (dispatch, getState) => {
        const {
            PlaylistsDataReducer: { playlists },
            SongsDataReducer: { songs },
        } = getState()

        // Update playlist in PlaylistsDataReducer
        dispatch(DeletePlaylistSong(songId, playlistId))

        // Check to see if we should delete the song from our state
        if (!isSharedSong(playlists, playlistId, songId)) {
            dispatch(deleteSong(songId))
        }

        // If we are deleting our song, we should dispatch a comment delete as well
        dispatch(bulkCommentsDelete(songs.byId[songId].comments))
    }
}

export const DeleteSongComment = (commentId, songId) => {
    return (dispatch, getState) => {
        dispatch(deleteSongComment(commentId, songId))
    }
}

export const FetchSongs = playlistId => {
    // At this point make async call to get songs for playlist
    return (dispatch, getState) => {
        // poopuhchoo - "YASSSS" (01/30/20)
        // Map ids to songs state
        const songs = []
        dispatch(fetchSongs(songs))
    }
}

// Helpers
const isSharedSong = (playlists, playlistId, songId) => {
    // Check to see if songId is part of another playlist
    // If it is do not run the deleteSong from state

    const val = Object.entries(playlists.byId).find(([key, playlistObj]) => {
        return key !== playlistId && playlistObj.songs.includes(songId)
    })

    return val
}