import React from 'react'
import PropTypes from 'prop-types';
import LoadingIndicator from '../components/LoadingIndicator';

export default function UserFlow(props) {
    const {isLoading, isError, error, success} = props;

    return (
        isLoading ? (
            <LoadingIndicator/>
        ) : (isError ?
            error : success
        )
    );
    
}

UserFlow.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool,
    loading: PropTypes.element.isRequired,
    error: PropTypes.element,
    success: PropTypes.element.isRequired
}
