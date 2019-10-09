import React, { useState, useEffect } from 'react'
import { BackHandler, View, StyleSheet, Platform } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Navigation } from 'react-native-navigation'

import AddItemButton from 'Gruvee/Components/Common/AddItemButton'
import SwipeablePlaylistItem from './components/SwipeablePlaylistItem/SwipeablePlaylistItem'
import * as StyleConstants from '@StyleConstants'
import * as NavigationConstants from '@NavigationConstants'

// Remove broken path warning
console.disableYellowBox = true
console.ignoredYellowBox = ['Could not find image']

// Mock Data
const mockSongs = [
    {
        id: 'song0',
        addedBy: 'SomeOtherMember',
        name: 'SomeCoolNewSong',
        artist: 'YaBoiAlec',
        album: 'Album of The Year',
        albumArtwork:
            'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Messengers.jpg/220px-Messengers.jpg',
        platformDeepLink: 'spotify://SomeDeepLink',
        comments: [
            'WOW SO GOOD.',
            'This could be better...',
            'Whats with the album name...',
        ],
    },
    {
        id: 'song1',
        addedBy: 'SomeOtherMember',
        name: 'SomeCoolNewSong',
        artist: 'YaBoiAlec',
        album: 'Album of The Year',
        albumArtwork:
            'https://www.clashmusic.com/sites/default/files/styles/article_feature/public/field/image/arcgods.jpg?itok=quBBnjX3',
        platformDeepLink: 'spotify://SomeDeepLink',
        comments: ['nice.'],
    },
    {
        id: 'song2',
        addedBy: 'SomeOtherMember',
        name: 'SomeCoolNewSong',
        artist: 'YaBoiAlec',
        album: 'Album of The Year',
        albumArtwork:
            'https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Northlane_Mesmer_artwork.jpg/220px-Northlane_Mesmer_artwork.jpg',
        platformDeepLink: 'spotify://SomeDeepLink',
        comments: ['Anothe one.', 'Another two?'],
    },
]
const mockData = [
    {
        id: 'Playlist0',
        name: 'Cool Kids Music',
        members: ['Ya Boi', 'Alec', 'Was Here'],
        songs: mockSongs,
        albumArtworkUrl: 'SomeBrokenImagePath',
    },
    {
        id: 'Playlist1',
        name: "YaBoi Alec's Playlist",
        members: ['Another', 'Name', 'Was Here'],
        songs: mockSongs,
        albumArtworkUrl:
            'https://99designs-blog.imgix.net/blog/wp-content/uploads/2017/12/attachment_68585523.jpg?auto=format&q=60&fit=max&w=930',
    },
    {
        id: 'Playlist2',
        name: 'Y A G',
        songs: mockSongs,
        members: ['Hi', 'I am', 'a name'],
        albumArtworkUrl: 'https://i.imgur.com/uoMh2y3.png',
    },
]

const PlaylistListView = () => {
    const [playlists, setPlaylist] = useState([])
    const [addPlaylistModalShown, setAddPlaylistModalShown] = useState(false)
    const keyExtractor = item => `${item.id}`
    const renderItem = ({ item }) => (
        <SwipeablePlaylistItem
            playlistData={item}
            deletePlaylistAction={deletePlaylistAction}
            deleteSongFromPlaylistAction={deleteSongFromPlaylistAction}
        />
    )

    useEffect(() => {
        // Call API set to playlists
        setPlaylist([...playlists, ...mockData])

        // Only if on Android, let's setup for backhandler override
        if (Platform.OS === 'android') {
            this.backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    return handleBackPress()
                }
            )

            // Setup event listener for overlay
            this.compDidAppearListener = Navigation.events().registerComponentDidAppearListener(
                ({ componentId }) => {
                    if (
                        componentId ===
                        NavigationConstants.ADD_PLAYLIST_MODAL_NAV_ID
                    ) {
                        setAddPlaylistModalShown(true)
                    }
                }
            )

            this.compDidDisappearListener = Navigation.events().registerComponentDidDisappearListener(
                ({ componentId }) => {
                    if (
                        componentId ===
                        NavigationConstants.ADD_PLAYLIST_MODAL_NAV_ID
                    ) {
                        setAddPlaylistModalShown(false)
                    }
                }
            )
        }

        return () => {
            // Again, if on android lets remove all our listeners
            if (Platform.OS === 'android') {
                this.backHandler.remove()
                this.compDidAppearListener.remove()
                this.compDidDisappearListener.remove()
            }
        }
    }, [])

    // Playlist Actions
    const createPlaylistAction = playlist => {
        // Set State
        setPlaylist([...playlists, playlist])
    }

    const deletePlaylistAction = playlistToDeleteId => {
        setPlaylist(
            playlists.filter(playlist => playlist.id !== playlistToDeleteId)
        )
    }

    const deleteSongFromPlaylistAction = (playlistId, songId) => {
        const updatedPlaylist = playlists.map(playlist => {
            if (playlist.id === playlistId) {
                playlist.songs = playlist.songs.filter(
                    song => song.id !== songId
                )
            }

            return playlist
        })

        setPlaylist(updatedPlaylist)
    }

    const handleBackPress = () => {
        if (addPlaylistModalShown) {
            Navigation.dismissOverlay(
                NavigationConstants.ADD_PLAYLIST_MODAL_NAV_ID
            )
            return true
        }
        return false
    }

    return (
        <>
            <SwipeListView
                style={styles.Container}
                contentContainerStyle={styles.ContentContainer}
                showsVerticalScrollIndicator={false}
                data={playlists}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
            />

            {/* MADPROPZ poopuhchoo */}
            <View style={styles.ButtonContainer}>
                <AddItemButton
                    style={styles.Button}
                    createAction={createPlaylistAction}
                />
            </View>
        </>
    )
}

// Styles
const styles = StyleSheet.create({
    Container: {
        backgroundColor: StyleConstants.BASE_BACKGROUND_COLOR,
    },
    ContentContainer: {
        padding: StyleConstants.TABLE_CONTAINER_CONTENT_SPACING,
        paddingBottom: StyleConstants.TABLE_CONTAINER_BOTTOM_PADDING,
    },
    ButtonContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        bottom: 50,
    },
    Button: {
        width: StyleConstants.ADD_BUTTON_SIZE,
        height: StyleConstants.ADD_BUTTON_SIZE,
    },
})

export default PlaylistListView
