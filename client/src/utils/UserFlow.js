import React from 'react'
import PropTypes from 'prop-types';
import LoadingIndicator from '../components/LoadingIndicator';

export default function UserFlow(props) {
    const {isLoading, isError, loading, error, success} = props;

    return (
        isLoading ? (
            loading ? loading : <LoadingIndicator/>
        ) : (isError ?
            error : success
        )
    );
    
}

UserFlow.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool,
    loading: PropTypes.element,
    error: PropTypes.element,
    success: PropTypes.element.isRequired
}
