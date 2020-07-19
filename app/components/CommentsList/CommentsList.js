import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'

// Redux
import { DeleteComment, FetchComments } from 'Gruvee/redux/actions/comments/CommentsActions'
import { AddComment } from 'Gruvee/redux/actions/comments/SharedCommentActions'
import { MapCommentsFromSongSelector } from 'Gruvee/redux/selectors/CommentsSelector'

import * as StyleConstants from 'Gruvee/config/styles'
import SongComment from 'Gruvee/lib/SongComment'

import SwipeableCommentItem from './components/SwipeableCommentItem'
import AddCommentTextInput from './components/AddCommentTextInput'

const styles = StyleSheet.create({
    Container: {
        backgroundColor: StyleConstants.BASE_BACKGROUND_COLOR,
        height: '100%',
    },
    ContentContainer: {
        padding: StyleConstants.TABLE_CONTAINER_CONTENT_SPACING,
    },
    Separator: {
        width: '100%',
        height: 1,
        backgroundColor: StyleConstants.SEPERATOR_BACKGROUND_COLOR,
    },
})

const CommentsList = ({
    currentUser,
    currentPlaylistId,
    comments,
    addComment,
    deleteComment,
    fetchComments,
    route,
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const commentsListRef = useRef(null)
    const { songId } = route.params

    useEffect(() => {
        fetchComments(songId, currentPlaylistId)
    }, [])

    // Actions
    const renderItem = ({ item }) => (
        <SwipeableCommentItem
            comment={item}
            deleteItemById={() => deleteComment(item.id, songId, currentPlaylistId)}
        />
    )

    const keyExtractor = item => `${item.id}`

    const addCommentAction = comment => {
        const newComment = comment.length ? new SongComment(comment, currentUser.id) : null
        addComment(newComment, songId, currentPlaylistId)
    }

    const runScrollToEnd = () => {
        if (commentsListRef && commentsListRef.current.scrollToEnd) {
            commentsListRef.current.scrollToEnd()
        }
    }

    return (
        <SafeAreaView style={styles.Container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 135 : 150}
            >
                <SwipeListView
                    // eslint-disable-next-line no-return-assign
                    listViewRef={ref => {
                        commentsListRef.current = ref
                        return ref
                    }}
                    style={{ height: '90%' }}
                    contentContainerStyle={styles.ContentContainer}
                    showsVerticalScrollIndicator
                    data={comments}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            tintColor={StyleConstants.REFRESH_INDICATOR_COLOR} // iOS only
                            refreshing={isRefreshing}
                            onRefresh={() => {
                                setIsRefreshing(true)
                                fetchComments(songId, currentPlaylistId).finally(() => {
                                    setIsRefreshing(false)
                                })
                            }}
                        />
                    }
                />
                <View style={styles.Separator} />
                <AddCommentTextInput
                    style={{ height: '10%' }}
                    addCommentAction={addCommentAction}
                    scrollToBottomAction={runScrollToEnd}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

// Redux Mappers
const mapStateToProps = (state, props) => {
    return {
        currentUser: state.UserDataReducer.user,
        currentPlaylistId: state.PlaylistsDataReducer.currentPlaylistId,
        comments: MapCommentsFromSongSelector(state, props),
    }
}
const mapDispatchToProps = dispatch => ({
    addComment: (comment, songId, playlistId) => dispatch(AddComment(comment, songId, playlistId)),
    deleteComment: (commentId, songId, currentPlaylistId) =>
        dispatch(DeleteComment(commentId, songId, currentPlaylistId)),
    fetchComments: (songId, playlistId) => dispatch(FetchComments(songId, playlistId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList)
