// LilCazza - "I copy and pasted this from stackoverflow. (I have no idea what it does, but everything breaks if it's not here" (02/03/20)
// curiousdrive - "We are neighbors on the internet" (04/20/20)
// MrDemonWolf - "2020 is year of the Contagion Movie monkaS" (03/20/20)
// isakfk1234 - "incoming code" (04/20/20)
import React, { useEffect, useState, useRef } from 'react'
import { RefreshControl, SafeAreaView, StyleSheet, StatusBar, View } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'

// Redux
import { connect } from 'react-redux'
import { FetchPlaylists } from 'Gruvee/redux/actions/playlists/SharedPlaylistActions'
import { MapPlaylistsFromUserSelector } from 'Gruvee/redux/selectors/PlaylistsSelector'

import AddItemButton from 'Gruvee/components/common/AddItemButton'
import * as StyleConstants from '@StyleConstants'
import SwipeablePlaylistItem from './components/SwipeablePlaylistItem'
import AddPlaylistBottomSheet from './components/AddPlaylistBottomSheet'

// Remove broken path warning
console.disableYellowBox = true
console.ignoredYellowBox = ['Could not find image']

// Styles
const styles = StyleSheet.create({
    Container: {
        zIndex: 0,
        height: '100%',
        backgroundColor: StyleConstants.BASE_BACKGROUND_COLOR,
    },
    // QuantumBrat - "BOIII (this must always be on line 147)" line 147 must! be on line 147..so... find a place for it ;) MiniK" (02/11/20)
    ContentContainer: {
        padding: StyleConstants.TABLE_CONTAINER_CONTENT_SPACING,
        // marginTop: 150, // Depends if this is rendered on iOS or not because of largeTitle
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
    SignOutButtonContainer: {
        flexDirection: 'row',
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 70,
        backgroundColor: StyleConstants.BASE_BACKGROUND_COLOR,
    },
})

const PlaylistListView = ({ fetchPlaylists, playlists }) => {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const keyExtractor = item => `${item.id}`
    const renderItem = ({ item }) => <SwipeablePlaylistItem playlistData={item} />
    const bottomSheetRef = useRef(null)

    useEffect(() => {
        console.log('Fetching latest playlists')
        fetchPlaylists()
    }, [])

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.Container}>
                <SwipeListView
                    contentContainerStyle={styles.ContentContainer}
                    showsVerticalScrollIndicator={false}
                    data={playlists}
                    keyExtractor={keyExtractor}
                    refreshControl={
                        <RefreshControl
                            tintColor={StyleConstants.REFRESH_INDICATOR_COLOR} // iOS only
                            refreshing={isRefreshing}
                            onRefresh={() => {
                                setIsRefreshing(true)
                                fetchPlaylists().finally(() => {
                                    setIsRefreshing(false)
                                })
                            }}
                        />
                    }
                    renderItem={renderItem}
                />
            </SafeAreaView>
            {/* MADPROPZ poopuhchoo */}
            <View style={styles.ButtonContainer}>
                <AddItemButton
                    style={styles.Button}
                    addItemAction={() => {
                        expandBottomSheet(bottomSheetRef)
                    }}
                />
            </View>
            <AddPlaylistBottomSheet ref={bottomSheetRef} />
        </>
    )
}

// Actions
const expandBottomSheet = bottomSheetRef => {
    if (bottomSheetRef.current) {
        // TODO: To fix current issue with dismissing card, call this thing twice
        bottomSheetRef.current.snapTo(0)
        bottomSheetRef.current.snapTo(0)
    } else {
        console.warn('Could not dismiss bottom sheet')
    }
}

// Redux Mappers
const mapStateToProps = state => {
    return {
        // At this point we should already have the user data in our state
        // Grab the proper reducer, and pull in all playlist ids
        playlists: MapPlaylistsFromUserSelector(state),
    }
}

const mapDispatchToProps = dispatch => ({
    fetchPlaylists: () => dispatch(FetchPlaylists()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistListView)
