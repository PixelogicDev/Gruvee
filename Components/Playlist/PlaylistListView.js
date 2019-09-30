import React, { Fragment, useState, useEffect } from 'react'
import { BackHandler, View, StyleSheet, FlatList, Platform } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Navigation } from 'react-native-navigation'

import * as StyleConstants from '../../StyleConstants'
import * as NavigationConstants from '../../NavigationConstants'
import CardItem from './CardItem'
import AddButton from './Buttons/AddButton'

// Remove broken path warning
console.disableYellowBox = true
console.ignoredYellowBox = ['Could not find image']

const mockData = [
    {
        id: 'Playlist0',
        name: 'Cool Kids Music',
        numMembers: 1234,
        numSongs: 7,
        albumArtworkUrl: 'SomeBrokenImagePath',
    },
    {
        id: 'Playlist1',
        name: "YaBoi Alec's Playlist",
        numMembers: 1234,
        numSongs: 8000,
        albumArtworkUrl:
            'https://99designs-blog.imgix.net/blog/wp-content/uploads/2017/12/attachment_68585523.jpg?auto=format&q=60&fit=max&w=930',
    },
    {
        id: 'Playlist2',
        name: 'Y A G',
        numMembers: 667,
        numSongs: 100,
        albumArtworkUrl: 'https://i.imgur.com/uoMh2y3.png',
    },
]
const styles = StyleSheet.create({
    Container: {
        backgroundColor: StyleConstants.BASE_BACKGROUND_COLOR,
    },
    ContentContainer: {
        padding: 25,
        paddingBottom: 100,
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

const PlaylistListView = () => {
    const [playlists, setPlaylist] = useState([])
    const [addPlaylistModalShown, setAddPlaylistModalShown] = useState(false)
    const keyExtractor = (item, index) => item.id
    const renderHiddenItem = ({}) => <SwipeAction />
    const renderItem = ({ item }) => (
        <CardItem
            playlistData={item}
            deletePlaylistAction={deletePlaylistAction}
            isLastItem={playlists.length === 1}
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
                ({ componentId, componentName, passProps }) => {
                    if (
                        componentId ===
                        NavigationConstants.ADD_PLAYLIST_MODAL_NAV_ID
                    ) {
                        setAddPlaylistModalShown(true)
                    }
                }
            )

            this.compDidDisappearListener = Navigation.events().registerComponentDidDisappearListener(
                ({ componentId, componentName, passProps }) => {
                    console.log(componentId)
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
                backHandler.remove()
                compDidAppearListener.remove()
                compDidDisappearListener.remove()
            }
        }
    }, [])

    const createPlaylistAction = playlist => {
        // Set State
        setPlaylist([...playlists, playlist])
    }

    const deletePlaylistAction = playlistToDeleteId => {
        setPlaylist(
            playlists.filter(playlist => playlist.id !== playlistToDeleteId)
        )
    }

    const handleBackPress = () => {
        console.log(addPlaylistModalShown)
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
            ></SwipeListView>

            {/* MADPROPZ poopuhchoo */}
            <View style={styles.ButtonContainer}>
                <AddButton
                    style={styles.Button}
                    createAction={createPlaylistAction}
                ></AddButton>
            </View>
        </>
    )
}

export default PlaylistListView
