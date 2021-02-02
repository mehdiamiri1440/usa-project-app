import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';

import * as commentsActions from '../../redux/commentsAndRatings/actions';

const Comments = props => {

    const {
        userId,
        commentsAndRatings = {},
        commentsList = []
    } = props;

    useEffect(_ => {
        if (userId)
            props.fetchAllComments(userId);
    }, [userId]);

    const renderListEmptyComponent = _ => {
        return (
            <Text>
                list empty
            </Text>
        )
    };

    const renderItem = (({ item, index }) => {

        return (
            <View>
                <Text>

                </Text>
            </View>
        )
    });

    return (
        <View>
            <FlatList
                renderItem={renderItem}
                ListEmptyComponent={renderListEmptyComponent}
                data={commentsList}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    )
};

const mapStateToProps = (state) => {
    const {
        commentsList,
        commentsAndRatings,
        commentsLoading,
        commentsFailed,
        commentsError,
        commentsMessage,
    } = state.commentsAndRatingsReducer;

    return {
        commentsList,
        commentsAndRatings,
        commentsLoading,
        commentsFailed,
        commentsError,
        commentsMessage,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllComments: userId => dispatch(commentsActions.fetchAllComments(userId))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Comments);