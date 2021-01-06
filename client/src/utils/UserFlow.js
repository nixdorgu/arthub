import React from 'react'
import PropTypes from 'prop-types';
import { CircularProgress } from "@material-ui/core";

export default function UserFlow(props) {
    const {isLoading, isError, loading, error, success} = props;

    return (
        isLoading ? (
            loading ? loading : <CircularProgress className="loading-indicator" color="secondary"/>
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
